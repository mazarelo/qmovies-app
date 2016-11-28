myApp.controller("TvPlayController" , function( $scope, tmdb , window , folder , $routeParams , qmovies , eztvapi , webTorrent , dates , $rootScope) {
  const self = this;

  /* removes torrents on exiting the window */
  $scope.$on('$locationChangeStart', function( event ) {
    event.preventDefault();
    webTorrent.stopAllTorrents();
    history.back();
  });

  self.extractDomain = function(url) {
      var domain;
      //find & remove protocol (http, ftp, etc.) and get domain
      if (url.indexOf("://") > -1) {
          domain = url.split('/')[2];
      }
      else {
          domain = url.split('/')[0];
      }

      if(url.indexOf("www.") > -1){
        domain = domain.split('www.')[1];
      }
      //find & remove port number
      domain = domain.split(':')[0];
      domain = domain.split('.')[0];
      return domain;
  }

    self.loadTorrents = function(){
      self.loading = true;
      
      eztvapi.getSerieInfo().then(function(response){
        console.log("Eztv:",response.data);
        self.eztvData = response.data;
      })
      .then(function(){
        self.torrents = [];
        self.eztvData.episodes.map(function (item) {
          if(item.season == $routeParams.season && item.episode == $routeParams.episode) {
            self.torrents = item.torrents;
          }
        });
        console.log("Torrents" , self.torrents);

        if(Object.keys(self.torrents).length > 0){
          console.log("found");
        }

        self.loading = false;
        /*
        qmovies.getTvEpisodeLinks(self.info.name).then(function(results){
          var links = [];
          console.log(results);
          results.data.results.forEach(function(item){
            let domainName = self.extractDomain(item);
            links.push({ domain:domainName, url:item });
          });

          self.torrents = links;
          self.loading = false;
        });
        */
      });
    }

  self.playTorrent = function(){
    self.loading = true;

    //let hash = `magnet:?xt=urn:btih:${magnet}&dn=${self.info.name}&tr=http://track.one:1234/announce&tr=udp://track.two:80&rt=`;
    /*
    let link = self.download;
    document.getElementById("player").innerHTML = `<iframe src="${link}" width="100%" frameborder="0" allowfullscreen></iframe>`;
    self.loading = false;
    document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
    document.querySelector(".info-content").style.visibility = "hidden";
    */
    //hash = hash.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i);
    console.log(self.download);
    $scope.MovieTitle = "waiting";
    webTorrent.play(self.download).then(function(response){
      $scope.MovieTitle = response;
      self.loading = false;
    })
    .then(function(){

    });

  };
});
