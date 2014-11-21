angular.module('starter.services', [])

.factory('$appSettings', function() {
  appState = window.localStorage.getItem("appState");
  appState = JSON.parse(appState);
  if (appState == null) {
    appState = {
      serverUrl: "http://localhost:5000",
      deviceId: 1,
      locationServices: true,
      fuzzingValue: 0,
      timeLastSubmit: 0
    }
    window.localStorage.setItem("appState", JSON.stringify(appState));
  }
  return appState;
})

.factory("$map", function() {
  const SWARTHMORE = new plugin.google.maps.LatLng(39.90652,-75.35199);

  var map = plugin.google.maps.Map.getMap({
    'backgroundColor': 'white',
    'mapType': plugin.google.maps.MapTypeId.ROADMAP,
    'controls': {
      'compass': true,
      'myLocationButton': false,
      'indoorPicker': false,
      'zoom': true
    },
    'gestures': {
      'scroll': true,
      'tilt': false,
      'rotate': false
    },
    'camera': {
      'latLng': SWARTHMORE,
      'tilt': 0,
      'zoom': 15,
      'bearing': 0
    }
  });

  var strictBounds = new plugin.google.maps.LatLngBounds(
   new plugin.google.maps.LatLng(39.910812, -75.358191), 
   new plugin.google.maps.LatLng(39.897306, -75.345037)
  );

  var evtName = plugin.google.maps.event.dragend;
});