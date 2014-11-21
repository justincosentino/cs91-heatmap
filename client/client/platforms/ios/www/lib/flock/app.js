function locationSwitchChanged() {
  if (locationSwitch.isChecked()) {
    menu.setMainPage('mapClusterView.html', {closeMenu: false});
  }
  else {
    menu.setMainPage('noLocationServices.html', {closeMenu: false});
  }
};

function fuzzingSwitchChanged() {
  alert(fuzzingSwitch.isChecked() ? 'Fuzzing on' : 'Fuzzing off');
};

function mapView() {
  if (locationSwitch.isChecked()) {
    menu.setMainPage('mapClusterView.html', {closeMenu: true});
  }
  else {
    menu.setMainPage('noLocationServices.html', {closeMenu: true});
  }
};

(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope) {
    
    var map;
    document.addEventListener("deviceready", function() {
      
      var div = document.getElementById("map_canvas");
      map = plugin.google.maps.Map.getMap(div);
      alert(JSON.stringify(map));
    }, false);

  });

  module.factory('$map', function(){
    var map;
    return map;
  });

})();
