from flask import Flask, request
from pymongo import MongoClient
from bson import BSON, json_util
from time import time
from hashlib import sha1, md5
from sklearn import cluster
import json
import hmac
import base64
import uuid

"""

Start application and connect to database

"""

app = Flask(__name__)
app.debug = True

client = MongoClient('localhost', 27017)
db = client.test_database

"""

Globals

"""

MAX_LAT = 39.910812
MIN_LAT = 39.897306
MIN_LONG = -75.358191
MAX_LONG = -75.345037

LATITUDE = 'lat'
LONGITUDE = 'long'
USER_ID = 'uid'
TIME = 'time'
SALT = 'salt'
HASH = 'hash'

LOCATION_FIELDS = [LATITUDE, LONGITUDE, TIME]
#LOCATION_FIELDS = [LATITUDE, LONGITUDE, TIME, USER_ID]
USER_FIELDS = [USER_ID]
TIME_DELAY = 36000000 # 15 mins

"""

CONTROLLERS

"""

# Gets all locations that are younger than TIME_DELAY
@app.route("/getLocations")
def getLocation():
    locations = db.locations
    str_locs = []
    for location in locations.find():
        if TIME in location:
            if int(location[TIME]) > time() - TIME_DELAY:
                str_locs.append(location)
    return json.dumps(str_locs, default=json_util.default)

# Posts a location to the database
@app.route("/postLocation")
def postLocation():
    location = getFieldsOr400(request, LOCATION_FIELDS)
    if not location: return "Bad Request", 400

    if locationInRange(location):
        db.locations.insert(location)
        return str(location), 200
    else:
        return "Location out of range"

# Registers a new uid to the database
@app.route("/registerUser")
def registerUser():
    user = getFieldsOr400(request, USER_FIELDS)

    # bad request
    if not user: return "Bad Request", 400

    existing = db.users.find_one({USER_ID: user[USER_ID]})
    if existing:
        return "User already exists"

    # TODO: gen uid based off input uuid.uuid4().hex
    db.users.insert(user)
    return "Success" , str(user)

# Returns clustering information
@app.route("/getClusters")
def getClusters():
    locations = db.locations
    print locations
    return json.dumps(locations, default=json_util.default)



"""

HELPERS

"""

# Verifies that the hash, salt combo is genuine
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
        
    return hash == request.args[HASH] and salt == request.args[SALT]

# Ensures that all the required <fields> are in a supplied <request>
# Returns a dict with fields or an error response
def getFieldsOr400(request, fields):
    obj = {}
    for field in fields:
        val = request.args.get(field)
        if not val:
            return False
        obj[field] = val
    return obj

# Checks whether a given location dict is in Swarthmore's range
def locationInRange(location):
    return float(location[LATITUDE]) >= MIN_LAT and \
            float(location[LATITUDE]) <= MAX_LAT and \
            float(location[LONGITUDE]) >= MIN_LONG and \
            float(location[LONGITUDE]) <= MAX_LONG

    
if __name__ == "__main__":
    app.run()
