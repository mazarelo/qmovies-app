'use strict';
var myApp = angular.module('movies', ['ngRoute', 'ngStorage' , 'chrome-image-storage']);

myApp.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
      $rootScope.$apply(function() {
        $rootScope.online = false;
      });
    }, false);

    $window.addEventListener("online", function() {
      $rootScope.$apply(function() {
        $rootScope.online = true;
      });
    }, false);

    Notification.requestPermission().then(function(result) {
      //console.log(result);
    });
});
