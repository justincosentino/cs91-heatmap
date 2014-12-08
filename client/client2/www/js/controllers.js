angular.module('starter.controllers', ['ionic'])
.controller('MapCtrl', function($ionicPlatform, $scope, $appSettings, $http) {

	$scope.toShow = $appSettings.getLocationServices();

	$ionicPlatform.ready(function() {

		if ($appSettings.getDeviceId == "UNKOWN") {
			$appSettings.setDeviceId(device.uuid);
		}

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
			    'zoom': 17,
			    'bearing': 0
		  	}
		});

		map.setDiv(div);

		$scope.findMe = function() {

			var onFindMeSuccess = function(position) {
			    current = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.addMarker({
			    	'position': current,
			  	}, function(marker) {
			  		
			  	});
			};


			function onFindMeError(error) {
			  	alert("Whoops, something went wrong when trying to get your location. Please try again.");
			    console.log('code: '    + error.code    + '\n' +
			          		'message: ' + error.message + '\n');
			}

			navigator.geolocation.getCurrentPosition(onFindMeSuccess, onFindMeError);
		}

		$scope.refresh = function() {
			$http.get($appSettings.serverUrl + '/getLocations').
			  	success(function(data, status, headers, config) {

			  		map.clear();

			  		$scope.findMe();

			  		for (var i = 0; i < data.length; i++) {

			  			var point = new plugin.google.maps.LatLng(parseFloat(data[i].lat), parseFloat(data[i].long));
      
				  		map.addCircle({
						  	'center': point,
						  	'radius': 10,
						  	strokeColor: "rgba(95, 158, 245, 0)",
					      	strokeWeight: 1,
					      	fillColor: "rgba(95, 158, 245, 0.2)"
						}, function(circle) {
							
						});
			  		}
			  	}).
			  	error(function(data, status, headers, config) {
			  		alert("Whoops, something went wrong when fetching location data. Please try again.");
			  	});		
		};

		$scope.refresh();

		// UPDATING SCROLL BOUNDS WOULD GO HERE IF I KNEW HOW TO DO IT
		// map.on(plugin.google.maps.event.MARKER_DRAG_END, onDragEnd);
		// var strictBounds = new plugin.google.maps.LatLngBounds(
		//  new plugin.google.maps.LatLng(39.910812, -75.358191), 
		//  new plugin.google.maps.LatLng(39.897306, -75.345037)
		// );

		window.navigator.geolocation.getCurrentPosition(function(location) {
        	console.log('Preliminary Location from Cordova');
    	});

   	 	var bgGeo = window.plugins.backgroundGeoLocation;

	    var updateAppState = function(response) {
	        bgGeo.finish();
	    };

	    var callbackFn = function(location) {
			
			timestamp = new Date().getTime();
	        
	        // Only update the position if we have a valid UUID, if the user has enabled location tracking,
	        // and if the user has not submitted in the last 15 minutes
	        if ($appSettings.getDeviceId != "UNKOWN" && 
	        	$appSettings.locationServices &&
	        	timestamp - $appSettings.setTimeLastSubmit > 900000) {
	        
		        $http.get($appSettings.serverUrl + '/postLocation?lat=' + location.latitude + 
		        											   '&long=' + location.longitude +
		        											   '&time=' + timestamp
		        ).
			  	success(function(data, status, headers, config) {
					console.log("/postLocation SUCCESS");
					console.log(data);
					$appSettings.setTimeLastSubmit(timestamp);
				}).
				error(function(data, status, headers, config) {
					console.log("/postLocation ERROR");
					console.log(data);
				});

	        } else {
	        	console.log("Did not send POST: Invalid UUID, too soon, or location services turned off");
	        }	

	        updateAppState.call(this);

	    };

	    var failureFn = function(error) {
	        console.log('BackgroundGeoLocation error');
	    };

	    bgGeo.configure(callbackFn, failureFn, {
	        //url: $appSettings.serverUrl + '/postLocation',
	        url: '',
	        params: {},
	        headers: {},
	        desiredAccuracy: 10,
	        stationaryRadius: 20,
	        distanceFilter: 30,
	        notificationTitle: 'Background tracking', 
	        notificationText: 'ENABLED',
	        activityType: 'Other',
	        debug: false, 
	        stopOnTerminate: false 
	    });

	    bgGeo.start();
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