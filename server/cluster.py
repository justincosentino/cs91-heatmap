print(__doc__)

import numpy as np

from time import time
from sklearn.cluster import DBSCAN, AffinityPropagation, estimate_bandwidth, MeanShift
from sklearn import metrics
from sklearn.datasets.samples_generator import make_blobs
from sklearn.preprocessing import StandardScaler
import flock 
from pymongo import MongoClient
import matplotlib.pyplot as plt
from itertools import cycle, combinations
import math

PLOT = False
POPULATION_THRESHOLD = 1
CENTER = 'center'
POPULATION = 'population'
RADIUS = 'radius'

DB_SCAN = 0
MEAN_SHIFT = 1
CLUSTER_ALG = MEAN_SHIFT

client = MongoClient('localhost', 27017)
flockdb = client.test_database

# returns list of circles, each with 
# center, size, opacity
def clusterData():
    clusters = processClusterData()
    return clusters.values()

def processClusterData():
    if CLUSTER_ALG == DB_SCAN:
        raw_locations, labels = dbScan()
    elif CLUSTER_ALG == MEAN_SHIFT:
        raw_locations, labels, cluster_centers = meanShift()

    clusters = {}
    for i in range(len(raw_locations)):
        existing = clusters.get(labels[i], {'data':[]})
        existing['data'].append(list(raw_locations[i]))
        clusters[labels[i]] = existing

    toDel = []
    for cluster, d in clusters.items():
        d['population'] = len(d['data'])
    
        if CLUSTER_ALG == DB_SCAN:
            d['center'] = findCenter(d)
            if -1 in clusters: del clusters[-1]
        elif CLUSTER_ALG == MEAN_SHIFT:
            if d['population'] < POPULATION_THRESHOLD:
                toDel.append(clusters[cluster])
                continue
            center = list(cluster_centers[cluster])
            center.reverse()
            d['center'] = center
        
        d['radius'] = meanDistance(d['data'])
        del d['data']

    for item in toDel:
        del clusters[item]

    return clusters


def getLocationsArray():
    locations = flockdb.locations
    str_locs = []
    for location in locations.find():
      if flock.TIME in location:
        if int(location[flock.TIME]) > time() - flock.TIME_DELAY:
          str_locs.append([float(location[flock.LONGITUDE]), float(location[flock.LATITUDE])])
    return np.array(str_locs)

def dbScan():
    raw_locations = getLocationsArray()

    db = DBSCAN(min_samples=POPULATION_THRESHOLD, eps=.00015).fit(raw_locations)
    core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
    core_samples_mask[db.core_sample_indices_] = True
    labels = db.labels_

    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)

    if PLOT:
        # Black removed and is used for noise instead.
        unique_labels = set(labels)
        colors = plt.cm.Spectral(np.linspace(0, 1, len(unique_labels)))
        for k, col in zip(unique_labels, colors):
            if k == -1:
                # Black used for noise.
                col = 'k'

            class_member_mask = (labels == k)

            xy = raw_locations[class_member_mask & core_samples_mask]
            plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
                 markeredgecolor='k', markersize=14)

            xy = raw_locations[class_member_mask & ~core_samples_mask]
            plt.plot(xy[:, 0], xy[:, 1], 'o', markerfacecolor=col,
                 markeredgecolor='k', markersize=6)

        plt.title('Estimated number of clusters: %d' % n_clusters_)
        plt.show()

    return raw_locations, labels


def meanShift():
    raw_locations = getLocationsArray()
    bandwidth = estimate_bandwidth(raw_locations, quantile=0.1, n_samples=len(raw_locations))
    ms = MeanShift(bandwidth=bandwidth, bin_seeding=False)
    ms.fit(raw_locations)
    labels = ms.labels_
    cluster_centers = ms.cluster_centers_

    labels_unique = np.unique(labels)
    n_clusters_ = len(labels_unique)

    if PLOT:
        colors = cycle('bgrcmykbgrcmykbgrcmykbgrcmyk')
        for k, col in zip(range(n_clusters_), colors):
            my_members = labels == k
            cluster_center = cluster_centers[k]
            plt.plot(raw_locations[my_members, 0], raw_locations[my_members, 1], col + '.')
            plt.plot(cluster_center[0], cluster_center[1], 'o', markerfacecolor=col,
           markeredgecolor='k', markersize=14)
        plt.title('Estimated number of clusters: %d' % n_clusters_)
        plt.show()

    return raw_locations, labels, cluster_centers

def distance(p0, p1):
    return math.sqrt((p0[0] - p1[0])**2 + (p0[1] - p1[1])**2)

def maxDistance(lst):
    max_dist = distance(lst[0], lst[1])
    for p0, p1 in combinations(lst, 2):
        max_dist = max(max_dist, distance(p0, p1))
    return max_dist

def meanDistance(lst):
    total = distance(lst[0], lst[1])
    for p0, p1 in combinations(lst, 2):
        total += distance(p0, p1)

    n = len(lst)
    r = 2
    mean = total*1.0 / (math.factorial(n)/(math.factorial(r)*math.factorial(n-r)))
    return mean

def findCenter(d):
    long = [location[0] for location in d['data']]
    lat = [location[1] for location in d['data']]
    avg_long = sum(long)/(float(len(long)))
    avg_lat = sum(lat)/(float(len(lat)))
    return [avg_lat, avg_long]
