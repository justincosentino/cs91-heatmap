angular.module('starter.controllers', ['ionic'])
.controller('MapCtrl', function($ionicPlatform, $scope, $appSettings, $http) {

	$scope.toShow = $appSettings.getLocationServices();

	$ionicPlatform.ready(function() {

		if ($appSettings.getDeviceId == "UNKOWN") {
			$appSettings.setDeviceId(device.uuid);
		}

		const SWARTHMORE = new plugin.google.maps.LatLng(39.905174, -75.354227);
		
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
			    'zoom': 16,
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
		};

		$scope.refresh = function() {
			$http.get($appSettings.serverUrl + '/getClusters').
			  	success(function(data, status, headers, config) {

			  		map.clear();

			  		// $scope.findMe();

			  		var maxPopulation = 0;

			  		// var colors = ["rgba(241,238,246,.6)","rgba(189,201,225,.6)","rgba(116,169,207,.6)","rgba(43,140,190,.6)","rgba(4,90,141,.6)"];
			  		var colors = ["rgba(255,255,178,.6)","rgba(254,217,118,.6)","rgba(254,178,76,.6)","rgba(253,141,60,.6)","rgba(240,59,32,.6)","rgba(34,94,168,.6)","rgba(189,0,38,.6)"];

			  		for (var i = 0; i < data.length; i++) {
			  			if (data[i].population >= maxPopulation) {
			  				maxPopulation = data[i].population;
			  			}
			  		}

			  		console.log("MAX POPULATION: " + maxPopulation);

			  		for (var i = 0; i < data.length; i++) {

			  			var point = new plugin.google.maps.LatLng(parseFloat(data[i].center[0]), parseFloat(data[i].center[1]));
      					
			  			var percentage = data[i].population*1.0/maxPopulation;
			  			var colorIndex = Math.ceil(percentage * colors.length) - 1;

				  		map.addCircle({
						  	'center': point,
						  	'radius': 111319.892222*data[i].radius,
						  	strokeColor: "rgba(255,255,255,.0)",
					      	strokeWeight: 0.0,
					      	fillColor: colors[colorIndex]
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