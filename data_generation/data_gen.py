from graphics import *

NUM_LOCATIONS = 150
FRAME_WIDTH = 911
FRAME_HEIGHT = 1447
IMG_WIDTH = 600
IMG_HEIGHT = 954

# TOP-LEFT: 39.910226, -75.359353
# TOP-RIGHT: 39.898366, -75.349649

MAX_LAT = 39.910226
MIN_LAT = 39.898366
MIN_LONG = -75.359353
MAX_LONG = -75.349649


anchor = Point(FRAME_WIDTH/2, FRAME_HEIGHT/2)
i = Image(anchor, "map.gif")
win = GraphWin("Swarthmore", i.getWidth(), i.getHeight())
i.draw(win)
print i.getWidth(), i.getHeight()

f = open('locations.txt', 'w')
p = Point(50, 60)
p.draw(win)

num = NUM_LOCATIONS
locations = []
while num != 0:
	d = win.getMouse()
	d.draw(win)
	latitude = MAX_LAT - (float(d.getY())/float(IMG_HEIGHT))*(MAX_LAT - MIN_LAT)
	longitude = MIN_LONG + (float(d.getX())/float(IMG_WIDTH))*(MAX_LONG - MIN_LONG)
	location = (latitude, longitude)

	f.write(str(d.getX()) + ' ' + str(d.getY()) + '\n')
	
	print len(locations), location
	locations.append(location)
	num -= 1
print locations
f.close()
win.close()