'use strict';
var myApp = angular.module('myApp', ['ngRoute'] );

myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/pages/:pageName', {
    templateUrl: 'views/edit.html',
    controller: 'FormController'
  })
  .when('/', {
    templateUrl: 'main/main.html',
    controller: 'introController'
  })
  .when('/tv', {
    templateUrl: 'tv/tv.html',
    controller: 'PageController'
  })
  .when('/movies', {
    templateUrl: 'movies/movies.html',
    controller: 'UsersController'
  })
  .otherwise({
    redirectTo: "/"
  });

 /* $locationProvider.html5Mode(true); */
});
