'use strict';
/* Menu Controller */
myApp.controller("introController" , function($scope , queryKickass ){
  $scope.results = queryKickass.getSearch("walking dead").then(function successCallback(response) {
      console.log(response);
    });
});
