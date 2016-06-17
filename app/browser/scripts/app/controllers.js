

myApp.controller("MainController" , function($scope, folder, webTorrent , $rootScope ) {
  this.pageName = "Dope";
  this.node = process.versions.node;
  this.chrome =process.versions.chrome;
  this.electron = process.versions.electron;
  this.CurrentFilm = "None";
  this.createFolder = function(name){
    folder.new(name);
  };

  this.read = function(name){
    console.log(name);
    folder.readFolder(name);
  };

  this.remove = function(name){
    folder.removeFolder(name);
  };

  this.playTorrent = function(magnet){
    $rootScope.MovieTitle.inputModel = "waiting";
    webTorrent.play(magnet);
  };

});


