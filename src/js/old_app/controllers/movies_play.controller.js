myApp.controller("MoviesPlayController" , function( $scope, webTorrent , yify , $routeParams , window , $window  , $route) {
  const self = this;
  
  /* removes torrents on exiting the window */
  $scope.$on('$locationChangeStart', function( event ) {
    event.preventDefault();
    webTorrent.stopAllTorrents();
    history.back();
  });

  self.playTorrent = function(){
    self.loading = true;
    $scope.MovieTitle = "waiting";
    webTorrent.play(self.download).then(function(response){
      $scope.MovieTitle = response;
      self.loading = false;
    });
  };

  self.movieDetails = function(){
    self.loading = true;
    yify.movieDetails($routeParams.movieId).then(function(response){
      console.log(response);
      /* return if no data */
      if(!response.data) {
        $window.history.back();
        return;
      }
      if(Array.isArray(response.data.data.torrents.torrent)){
        self.torrents = response.data.data.torrents.torrent;
        self.download = self.torrents[0].url;
        console.log(response);
      }else{
        /* If there is 1 or more torrents problem fix */
        self.torrents = ( response.data.data.torrents.torrent.url ? [response.data.data.torrents.torrent] :response.data.data.torrents.torrent);
      }

      self.info = response.data.data;
      self.loading = false;
    });
  };

});