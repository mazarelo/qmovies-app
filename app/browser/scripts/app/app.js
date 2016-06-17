'use strict';
var myApp = angular.module('movies', ['ngRoute'] );

myApp.run(function($rootScope){
  $rootScope.MovieTitle = {inputModel: 'Testing rootscope'};
});

myApp.service('callback', function($rootScope ) {
  this.log = function(data){
    console.log(data);
    $rootScope.MovieTitle.inputModel = data; 
  };
});