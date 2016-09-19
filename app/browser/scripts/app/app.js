'use strict';
var myApp = angular.module('movies', ['ngRoute']);

myApp.run(function($window, $rootScope , folder) {
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
    folder.new("downloads/json");
});
