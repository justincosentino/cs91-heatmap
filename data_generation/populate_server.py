import sys
import urllib2
import time
from httplib import BadStatusLine

filename = sys.argv[1]

f = open(filename, 'r')

locations = []
for line in f.readlines():
	lat, long = line.split(' ')
	lat = lat.strip()
	long = long.strip()
	locations.append((lat, long))

t = str(int(time.time()))
for location in locations:
	try:
		urllib2.urlopen("http://localhost:5000/postLocation?lat="\
			+location[0]+"&long="+location[1]+"&time="+t)
	except BadStatusLine:
		print "could not fetch", url
    	pass

f.close()