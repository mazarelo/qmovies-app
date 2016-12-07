/* login */
myApp.controller("DownloadEpisodeController" , function( $scope , downloadTorrent , $routeParams, fileSystem , windows, notifications ) {
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

    if(self.magnet !== undefined && Object.keys(self.magnet).length > 0 ){
      //let bestQuality = self.magnet[Object.keys(self.magnet).sort().pop()];
      self.magnet = (process.env.downloadBestQuality )? self.magnet[Object.keys(self.magnet).sort().pop()] : self.magnet['480p'];
      downloadTorrent.download( self.magnet.url , $routeParams.tvId , season , episode).then(function(){
        //console.log("done downloading");
        self.isSaved = true;
      });
    }else{
      notifications.new("Im sorry, no streams available...", "", "Qmovies", "")
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

  self.checkLocaly = function(season,episode){
    let exists = fileSystem.fileExists(`downloads/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`);
    console.log("Exists",exists);
    if(exists){
      self.isSaved =  true;
    }else{
      self.isSaved =false;
    }
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
