'use strict';
var myApp = angular.module('movies', ['ngRoute'] );

myApp.run(function($rootScope){
  $rootScope.MovieTitle = {inputModel: 'Testing rootscope'};
});