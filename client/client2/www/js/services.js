angular.module('starter.services', ['ionic'])

.factory('$appSettings', function($ionicPlatform) {

  appState = window.localStorage.getItem("appState");
  appState = JSON.parse(appState);
  
  if (appState == null) {
    appState = {
      serverUrl: "http://localhost:5000",
      deviceId: "UNKOWN",
      locationServices: true,
      fuzzingValue: 0,
      timeLastSubmit: 0
    }
    window.localStorage.setItem("appState", JSON.stringify(appState));
  }

  appStateRet = {
    serverUrl: appState.serverUrl,
    deviceId: appState.deviceId,

    getLocationServices : function () {
      return appState.locationServices;
    },

    toggleLocationServices : function() {
      appState.locationServices = !appState.locationServices;
      window.localStorage.setItem("appState", JSON.stringify(appState));
      return appState.locationServices;
    },

    getFuzzingValue : function () {
      return appState.fuzzingValue;
    },

    setFuzzingValue : function(value) {
      appState.fuzzingValue = value;
      window.localStorage.setItem("appState", JSON.stringify(appState));
      return appState.fuzzingValue;
    },

    getTimeLastSubmit : function () {
      return appState.timeLastSubmit;
    },

    setTimeLastSubmit : function(value){
      appState.timeLastSubmit = value;
      window.localStorage.setItem("appState", JSON.stringify(appState));
      return appState.timeLastSubmit;
    },

    getDeviceId : function () {
      return appState.deviceId;
    },

    setDeviceId: function(id) {
      appState.deviceId = id;
      window.localStorage.setItem("appState", JSON.stringify(appState));
      return appState.setDeviceId;
    }

  };

  return appStateRet;

});
