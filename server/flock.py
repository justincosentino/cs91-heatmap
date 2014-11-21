from flask import Flask, request
from pymongo import MongoClient
from bson import BSON
from bson import json_util
from time import time
from hashlib import sha1
from hashlib import md5
import json
import hmac
import base64
import uuid

client = MongoClient('localhost', 27017)
app = Flask(__name__)
app.debug = True
db = client.test_database

LOCATION_FIELDS = ['lat', 'long', 'time']
#LOCATION_FIELDS = ['lat', 'long', 'time', 'uid']
USER_FIELDS = ['uid']


@app.route("/getLocations")
def getLocation():
    locations = db.locations
    str_locs = []
    for location in locations.find():
        print location
        if "time" in location:
            if int(location["time"]) > time() - 900:
                str_locs.append(location)
    return json.dumps(str_locs, default=json_util.default)

@app.route("/postLocation")
def postLocation():
    location = getFieldsOr400(request, LOCATION_FIELDS)
    if type(location) == tuple: return location
    db.locations.insert(location)
    return "Success" , str(location)

@app.route("/registerUser")
def registerUser():
    user = getFieldsOr400(request, USER_FIELDS)
    if type(user) == tuple: return user

    existing = db.users.find_one({'uid': user['uid']})
    if existing:
        return "User already exists"

    # TODO: gen uid based off input uuid.uuid4().hex
    db.users.insert(user)
    return "Success" , str(user)

@app.route("/getClusters")
def getClusters():
    pass

def verifyHash(request):
    sorted_params = request.args.keys()
    sorted_params.sort()

    msg = request.path
    if len(sorted_params) > 0:
        msg += "?"
    for param in sorted_params:
        msg += "%s=%s&" % (param, request.args[param])
    if len(sorted_params) > 0:
        msg = msg[:-1]

    h = hmac.new(b'1234567890', msg, sha1)
    hash = base64.b64encode(h.digest())
        
    return hash == request.args['hash'] and salt == request.args['salt']

def getFieldsOr400(request, fields):
    obj = {}
    for field in fields:
        val = request.args.get(field)
        if not val:
            return "Bad request", 400
        obj[field] = val
    return obj
    
if __name__ == "__main__":
    app.run()
