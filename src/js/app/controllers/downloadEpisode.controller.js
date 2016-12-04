/* login */
myApp.controller("DownloadEpisodeController" , function( $scope , downloadTorrent , $routeParams, fileSystem , windows ) {
  const self = this;
  self.isSaved = false;

  self.episode = function(season, episode , torrents){
    console.log("season:", season );
    console.log("episode:", episode);
    self.torrents = torrents;

    self.torrents.map(function (item) {
      if(item.season == season && item.episode == episode) {
        self.magnet = item.torrents;
        console.log("Torrent:", self.torrents);
      }
    });

    if(Object.keys(self.magnet).length > 0){
      //let bestQuality = self.magnet[Object.keys(self.magnet).sort().pop()];
      downloadTorrent.download(self.magnet['480p'].url, $routeParams.tvId , season , episode).then(function(){
        //console.log("done downloading");
        self.isSaved = true;
      });
    }
  }

  self.delete = function(season, episode){
    console.log(fileSystem.listAll(`downloads/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`));
  }

  self.playLocal = function(season, episode){
    fileSystem.findAllWithMovieExtension(`${process.env.APP_FILES}/downloads/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`, function(filename){
      console.log('-- found: ',filename);
      windows.open("file://"+filename);
      return filename;
    });
  }

});

/*
  fileSystem.findAllWithMovieExtension(`${process.env.APP_FILES}/downloads/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`, function(filename){
    console.log('-- found: ',filename);
    //windows.open("file://"+filename);
    self.filenameExists = filename;
  });

  if(self.filenameExists) {
    windows.open("file://"+self.filenameExists);
    return true;
  }
*/
