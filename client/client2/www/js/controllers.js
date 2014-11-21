angular.module('starter.controllers', ['ionic'])

.controller('MapCtrl', function($ionicPlatform, $scope) {
	$ionicPlatform.ready(function() {
		const SWARTHMORE = new plugin.google.maps.LatLng(39.90652,-75.35199);

		var div = document.getElementById("map_canvas");

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

		map.setDiv(div);
	});  
})

.controller('SettingsCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
});

