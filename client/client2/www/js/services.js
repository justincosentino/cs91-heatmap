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
      console.log("APP STATE, " + JSON.stringify(appState) + " " + value);
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
    }
  };


  return appStateRet;
});
