myApp.controller("MenuController" , function( $scope, window ) {
  console.log("menu initialized");

  this.minimize = function(){
     window.minimize();
  }
  this.maximize = function(){
     window.maximize();
  }
  this.close = function(){
     window.close();
  }
});
