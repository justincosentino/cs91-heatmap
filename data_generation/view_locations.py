from graphics import *
import sys

filename = sys.argv[1]

NUM_LOCATIONS = 1500
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

f = open(filename, 'r')

for line in f.readlines():
    lat, long = line.split(' ')
    lat = float(lat.strip())
    long = float(long.strip())

    x = ((long - MIN_LONG)/(MAX_LONG - MIN_LONG))*float(IMG_WIDTH) 
    y = ((MAX_LAT - lat)/(MAX_LAT - MIN_LAT))*float(IMG_HEIGHT)

    d = Point(x, y)
    d.draw(win)

win.getMouse()
f.close()
win.close()