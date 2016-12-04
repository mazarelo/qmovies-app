/* login */
myApp.controller("PlayEpisodeController" , function( $scope ) {
  const self = this;

  self.episode = function(season , episode , torrents ){
    console.log("season:", season );
    console.log("episode:", episode);
    self.torrents = torrents;
    /* test url = 'http://streamin.to/2io0duwvz10t'
    providers.filterProviders("http://streamin.to/ekiljfxzks0h").then(function(response){
      console.log(response);
    });
    */
    self.torrents.map(function (item) {
      if(item.season == season && item.episode == episode) {
        self.magnet = item.torrents;
        console.log("Torrent:", self.torrents);
      }
    });

    if(Object.keys(self.magnet).length > 0){
      //console.log(self.magnet[Object.keys(self.magnet).sort().pop()]);
      console.log("found", self.magnet);
    }
  }

});
