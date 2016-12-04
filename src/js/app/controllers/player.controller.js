/* login */
myApp.controller("PlayerController" , function( $scope , downloadTorrent , $routeParams ) {
  const self = this;
  self.title = "PLAYER";

  self.play = function(){
    downloadTorrent.findTorrentsById($routeParams.hash);
  }
});
