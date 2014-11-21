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

    document.addEventListener('deviceready', onDeviceReady, false);
    
    $scope.map = {};

    function onBtnClicked($scope) {
          alert('clicked')
          $scope.map.showDialog();
    }

    function onDeviceReady($scope) {  

      var button = document.getElementById('showbutton');
      button.addEventListener('click', onBtnClicked, false);

      var div = document.getElementById('map_canvas');
      $scope.map = plugin.google.maps.Map.getMap(div);
      alert($scope.map);
    }

  });

})();
