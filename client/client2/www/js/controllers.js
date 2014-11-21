angular.module('starter.controllers', ['ionic'])

.controller('MapCtrl', function($ionicPlatform, $scope, $appSettings, $http) {

	

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

		var strictBounds = new plugin.google.maps.LatLngBounds(
		 new plugin.google.maps.LatLng(39.910812, -75.358191), 
		 new plugin.google.maps.LatLng(39.897306, -75.345037)
		);

		var evtName = plugin.google.maps.event.dragend;

		console.log("MAPPPPPPPP");
		console.log(map)
		map.setDiv(div);

		var onSuccess = function(position) {
		    console.log('Latitude: '          + position.coords.latitude          + '\n' +
		          'Longitude: '         + position.coords.longitude         + '\n' +
		          'Altitude: '          + position.coords.altitude          + '\n' +
		          'Accuracy: '          + position.coords.accuracy          + '\n' +
		          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
		          'Heading: '           + position.coords.heading           + '\n' +
		          'Speed: '             + position.coords.speed             + '\n' +
		          'Timestamp: '         + position.timestamp                + '\n');
		}

		function onError(error) {
			console.log('code: '    + error.code    + '\n' +
		          		'message: ' + error.message + '\n');
		}

		var options = {timeout: 5000, enableHighAccuracy: false};
		
		var watchId = navigator.geolocation.watchPosition(onSuccess,
	                                         onError,
	                                         options);

		$scope.refresh = function() {
			$http.get($appSettings.serverUrl + '/getLocations').
			  success(function(data, status, headers, config) {
			  	for (var i = 0; i < data.length; i++) {
			  		console.log(data[i]);
			  		console.log(map);
			  // 		var point = plugin.google.maps.LatLng(float(data[i].lat), float(data[i].long));
			  // 		console.log(point);
			  // 		map.addCircle({
					//   'center': point,
					//   'radius': 100,
					//   'strokeColor' : '#880000',
					//   'strokeWidth': 5,
					//   'fillColor' : '#880000'
					// });
			  	}
			  }).
			  error(function(data, status, headers, config) {
			  	alert("Whoops, something went wrong. Please try again.")
			  });		
		}
	});  
})

.controller('SettingsCtrl', function($scope, $appSettings) {
	$scope.locationServices = $appSettings.locationServices;
	$scope.fuzzingValue = $appSettings.fuzzingValue;
	console.log($scope.fuzzingValue + " " + $scope.locationServices);
})
