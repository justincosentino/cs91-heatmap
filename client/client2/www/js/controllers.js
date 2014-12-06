angular.module('starter.controllers', ['ionic'])

.controller('MapCtrl', function($ionicPlatform, $scope, $appSettings, $http) {

	$scope.toShow = $appSettings.getLocationServices();

	$ionicPlatform.ready(function() {

		const SWARTHMORE = new plugin.google.maps.LatLng(39.90652,-75.35199);
		
		var div = document.getElementById("map_canvas");

		map = plugin.google.maps.Map.getMap({
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

		map.setDiv(div);

		$scope.refresh = function() {
			$http.get($appSettings.serverUrl + '/getLocations').
			  success(function(data, status, headers, config) {
			  	for (var i = 0; i < data.length; i++) {

			  		var point = new plugin.google.maps.LatLng(parseFloat(data[i].lat), parseFloat(data[i].long));
      
			  		map.addCircle({
					  'center': point,
					  'radius': 10,
					  strokeColor: "rgba(215, 44, 44, 0)",
				      strokeWeight: 1,
				      fillColor: "rgba(215, 44, 44, 0.2)"
					});

			  	}
			  }).
			  error(function(data, status, headers, config) {
			  	alert("Whoops, something went wrong. Please try again.")
			  });		
		}

		$scope.refresh();

		// map.on(plugin.google.maps.event.MARKER_DRAG_END, onDragEnd);

		// var strictBounds = new plugin.google.maps.LatLngBounds(
		//  new plugin.google.maps.LatLng(39.910812, -75.358191), 
		//  new plugin.google.maps.LatLng(39.897306, -75.345037)
		// );

		// var onSuccess = function(position) {
		//     console.log('Latitude: '          + position.coords.latitude          + '\n' +
		//           'Longitude: '         + position.coords.longitude         + '\n' +
		//           'Altitude: '          + position.coords.altitude          + '\n' +
		//           'Accuracy: '          + position.coords.accuracy          + '\n' +
		//           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		//           'Heading: '           + position.coords.heading           + '\n' +
		//           'Speed: '             + position.coords.speed             + '\n' +
		//           'Timestamp: '         + position.timestamp                + '\n');
		// }

		// function onError(error) {
		// 	console.log('code: '    + error.code    + '\n' +
		//           		'message: ' + error.message + '\n');
		// }

		// var options = {timeout: 5000, enableHighAccuracy: false};
		
		// var watchId = navigator.geolocation.watchPosition(onSuccess,
	 	//                                      onError,
	 	//                                      options);

	});  
})

.controller('SettingsCtrl', function($scope, $appSettings) {

	$scope.data = {
		fuzzingValue: $appSettings.getFuzzingValue(),
		locationServices: $appSettings.getLocationServices()
	}

	$scope.updateLocationServices = function() {
		$scope.data.locationServices = $appSettings.toggleLocationServices();
	}

	$scope.updateFuzzing = function() {
		$scope.data.fuzzingValue = $appSettings.setFuzzingValue($scope.data.fuzzingValue);
	}

});
