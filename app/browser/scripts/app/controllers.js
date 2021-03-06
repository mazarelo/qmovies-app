/* login */
myApp.controller("DownloadEpisodeController" , function( $scope , downloadTorrent , $routeParams, fileSystem , windows, notifications, userSettings ) {
  const self = this;
  self.isSaved = false;
  var serieTitle = document.querySelector(".title").textContent;

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
      notifications.new("Im sorry, no streams available...", "", `${serieTitle} S${season}E${episode}`, "")
    }
  }

  self.delete = function(season, episode){
    userSettings.get("user.downloadFolder").then(function(val){
      console.log(`${val}/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`);
      fileSystem.deleteFolderRecursively(`${val}/${$routeParams.tvId}/season-${season}/episode-${episode}`);
    });
  }

  self.playLocal = function(season, episode){
    fileSystem.findAllWithMovieExtension(`${process.env.APP_FILES}/downloads/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`, function(filename){
      console.log('-- found: ',filename);
      windows.open("file://"+filename);
      return filename;
    });
  }

  self.checkLocaly = function(season,episode){
    let exists = fileSystem.fileExists(`/tv/${$routeParams.tvId}/season-${season}/episode-${episode}`);
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

/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , fileSystem, notifications ) {
  const self = this;
  self.title = "OFFLINE FILES";
  self.tvHasFiles = true;
  self.moviesHasFiles = true;
  self.tmdbImgUrl = tmdb.imgRoute;

  self.typesOfSearch = {
    active: "tv-series",
    options:[
      {name: "Tv series", value:"tv-series"},
      {name: "Movies", value: "movies"}
    ]
  }

  self.getFeed = function(value){
    self.typesOfSearch.active = value;
  }

  self.getFeedTv = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    console.log("Tv Files:",self.filesInFolderTv);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("Your local Tv list is empty...", "", "Qmovies", function(){
        console.log("clicked no series downloaded");
      });
      return false
    }
    self.tvHasFiles = false;

    /* fetch files and get metadata */
    self.results = [];
    self.filesInFolderTv.forEach(function(item){
      tmdb.searchById(item).then(function(response){
        self.results.push(response.data);
      });
    });
    console.log("Results:",self.results);
  }

  self.getFeedMovies = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("Your local Movies list is empty...", "", "Qmovies", function(){
        console.log("clicked no movies downloaded");
      });
      return false
    }
    self.moviesHasFiles = true;
    /* fetch files and get metadata */
    self.results = [];
    self.filesInFolderTv.forEach(function(item){
      tmdb.searchById(item).then(function(response){
        self.results.push(response.data);
      });
      console.log(self.results);
    })
  }

});

/* login */
myApp.controller("MenuController" , function( $scope , $routeParams ) {
  const self = this;

  self.menuItems = {
    active:"",
    options:[
      { name: "Movies", href:"#/movies" },
      { name: "Tv Series", href:"#/tv-series" },
      { name: "Local", href:"#/local" }
    ]
  }

  this.openSettings = function(){
    $scope.showModal = true;
    document.getElementById("modal-12").classList.add("md-show");
    console.log("show modal:", $scope.showModal);
  }
});

/* login */
myApp.controller("MovieController" , function( $scope , $routeParams , tmdb, $rootScope, notifications ) {
  const self = this;
  self.title = "Movies";
  self.page = 1;

  /* changes sub-menu links dinamicly */
  self.typesOfSearch = {
    active:'popular',
    options:[
      {name: "Most Popular",value: "popular"},
      {name: "Top Rated", value: "top_rated"},
      {name: "Watch list", value: "watch list"}
    ]
  }

  self.getFeed = function(type = self.typesOfSearch.active){
    /* if offline tell user to connect */
    if(!$rootScope.online) notifications.new("Please re-connect to the internet!", "","No internet!"); return;

    tmdb.movieFeed(type, self.page).then(function(response){
      console.log(response);
      self.results = response.data.results;
      self.tmdbImgUrl = tmdb.imgRoute;
    });
  }

});

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
        console.log("Torrent:", self.magnet);
      }
    });

    if(Object.keys(self.magnet).length > 0){
      //console.log(self.magnet[Object.keys(self.magnet).sort().pop()]);
      console.log("found", self.magnet);
    }
  }

});

/* login */
myApp.controller("PlayerController" , function( $scope , downloadTorrent , $routeParams ) {
  const self = this;
  self.title = "PLAYER";

  self.play = function(){
    downloadTorrent.findTorrentsById($routeParams.hash);
  }
});

/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc , userSettings , notifications ) {
  const self = this;
  self.title = "Settings";
  self.requestRunning  = false;
  userSettings.get('user.downloadFolder').then(val =>{
    self.downloadPath = (val)? val : process.env.DOWNLOAD_PATH;
  })

  self.closeModal = function(){
    document.getElementById("modal-12").classList.remove("md-show");
  }

  userSettings.cacheStatus().then(response =>{
    if(response){
      document.getElementById("cached").checked = true;
    }else{
      document.getElementById("cached").checked = false;
    }
  })

  userSettings.maxQualityStatus().then(response =>{
    if(response){
      document.getElementById("maxQuality").checked = true;
    }else{
      document.getElementById("maxQuality").checked = false;
    }
  })

  userSettings.clearDownloadsOnExitStatus().then(response =>{
    if(response){
      document.getElementById("clearDownloads").checked = true;
    }else{
      document.getElementById("clearDownloads").checked = false;
    }
  })

  self.updateClearDownloads = function(){
    userSettings.get('user.deleteDownloadsOnExit').then(val => {
      if(val){
        userSettings.set('user.deleteDownloadsOnExit', false );
      }else{
        userSettings.set('user.deleteDownloadsOnExit', true );
      }
    });
  }

  self.changeLocalPath = function(){
    /*fileSystem.moveFiles(function(){
    });*/

    self.downloadPath = ipc.openFoldersDialog()[0];
    userSettings.set('user.downloadFolder', self.downloadPath );
    fileSystem.moveFiles( "", self.downloadPath, function(){

    });
  }

  self.updateCache = function(){
    userSettings.get('user.cache').then(val => {
      if(val){
        userSettings.set('user.cache', false );
      }else{
        userSettings.set('user.cache', true );
      }
    });
  }

  self.updateMaxQuality = function(){
    userSettings.get('user.maxQuality').then(val => {
      if(val){
        userSettings.set('user.maxQuality', false )
      }else{
        userSettings.set('user.maxQuality', true )
      }
    })
  }

});

/* login */
myApp.controller("TvController" , function( $scope , $routeParams , tmdb , cache , $rootScope ,notifications, windows) {
  const self = this;
  self.title = "Tv Series";
  self.page = 1;
  self.requestRunning = false;
  self.currentSearch = "getFeed";
  /* changes sub-menu links dinamicly */
  self.typesOfSearch = {
    active:'popular',
    options:[
      {name: "Most Popular",value: "popular"},
      {name: "On the Air", value: "on_the_air"},
      {name: "Top Rated", value: "top_rated"},
      {name: "Airing Today", value: "airing_today"},
      {name: "Favorites", value: "Favorites"}
    ]
  }

  self.genre = {
    value: 10765,
    options: [
      { value: 10759, name: "Action & Adventure" },
      { value: 16, name: "Animation" },
      { value: 35, name: "Comedy" },
      { value: 99, name: "Documentary" },
      { value: 18, name: "Drama" },
      { value: 10761, name: "Education" },
      { value: 10751, name: "Family" },
      { value: 10762, name: "Kids" },
      { value: 9648, name: "Mystery" },
      { value: 10763, name: "News" },
      { value: 10764, name: "Reality" },
      { value: 10765, name: "Sci-Fi & Fantasy" },
      { value: 10766, name: "Soap" },
      { value: 10767, name: "Talk" },
      { value: 10768, name: "War & Politics" },
      { value: 37, name: "Western" }
    ]
  }

  self.years = {
    value: 2016,
    options: function(){
      var input = [];
      for (let i = 1960; i <= 2016; i += 1) {
        input.push(i);
      }
      return input;
    }
  }

  self.sortBy = {
    value: "popularity.desc",
    options: [
      { value: "popularity.desc", name: "Popular" },
      { value: "primary_release_date.desc", name: "Year" },
      { value: "original_title.asc", name: "Title" },
      { value: "vote_average.desc", name: "Rate" }
    ]
  }

  /* gets current feed */
  self.getFeed = function(type = self.typesOfSearch.active){
    /* if offline tell user to connect */
    console.log($rootScope.online);
    if(!$rootScope.online){
      notifications.new("Please re-connect to the internet!", "./assets/img/internet.png","No internet!" , function(){
        console.log("clicked");
      });
      return;
    }
    /* allways get 1st page of the new feed*/
    if(type !== self.typesOfSearch.active){
      self.typesOfSearch.active = type;
      self.page = 1;
    }

    self.tmdbImgUrl = tmdb.imgRoute;
    console.log(self.tmdbImgUrl);
    tmdb.tvFeed(type , self.page ).then(function(response){
      console.log(response);
      self.results = response.data.results;

      if(!cache.get(type+"-"+self.page) ){
        cache.save(type+"-"+self.page , response , {timestamp: new Date() } );
      }

      self.loadMore();
      self.loadMore();
    });
  }

  /* load more method */
  self.loadMore = function(){
    self.page ++;
    /* activate loaders */
    self.loading = true;
    /* check what function to call */
    switch (self.currentSearch) {
      case "getFeed":
        tmdb.tvFeed(self.typesOfSearch.active , self.page).then(function(response){
          if(response.data.results.length === 0){
            return self.requestRunning = true;
          }else{
            response.data.results.forEach( function (arrayItem){
              self.results.push(arrayItem);
            });
            self.requestRunning = false;
            self.loading = false;
          };
        }, function(err){
          console.log("error", err);
          self.loading = false;
        });
      break;
      case "discover":
        tmdb.tvDiscover(`sort_by=${self.sortBy.value}` , `with_genres=${self.genre.value}` , `page=${self.page}` ).then(function(response){
          if(response.data.results.length === 0){
            return self.requestRunning = true;
          }else{
            response.data.results.forEach( function (arrayItem){
              self.results.push(arrayItem);
            });
            self.requestRunning = false;
            self.loading = false;
          }
        }, function(err){
          console.log("error", err);
          self.loading = false;
        });
      break;
      case "search":
        tmdb.tvSearch(`${self.query}`, self.page).then(function(response){
          if(response.data.results.length === 0){
            return self.requestRunning = true;
          }else{
            self.results = response.data.results;
            self.loading = false;
          }
        });
      break;
    }
    self.loading = false;
  }

  self.search = function(){
    self.loading = true;
    self.page = 1;
    /* scroll feed-ajax to top */
    if(self.query.length >3){
      windows.scrollToTop(1000);
      tmdb.tvSearch(`${self.query}`, self.page).then(function(response){
        self.results = response.data.results;
        self.loading = false;
      }, function(err){
        console.log("error", err);
        self.loading = false;
      });
    }else if(self.query.length <=3){
      self.loading = false;
    }
  }

});

/* login */
myApp.controller("TvMainController" , function( $scope , $routeParams , tmdb, tvTorrents ) {
  const self = this;

  self.requestRunning = false;
  self.tmdbImgUrl = tmdb.imgRoute;

  /* changes sub-menu links dinamicly */
  self.typesOfSearch = {
    active:'genres',
    options:[
      {name: "genre", value: "genre"}
    ]
  };

  self.tabs = {
    active:'info',
    options:[
      {name: "info", value: "info"},
      {name: "trailer", value: "trailer"},
      {name: "cast", value: "cast"},
      {name: "crew", value: "crew"}
    ]
  };

  self.getNumber = function(num) {
    return new Array(num);
  }

  self.getSeasonInfo = function( season = 1 ){
    self.currentSeason = season;

    tmdb.tvSeason($routeParams.tvId , season).then(function(response){
      console.log(response);
      self.episodes = response.data.episodes;
    });
  }

  self.streamExists = function(season, episode){
    self.torrents.map(function (item) {
      if(item.season == season && item.episode == episode) {
        return true
      }
      return false;
    });
  }

  self.loadData = function(){
    tmdb.searchById($routeParams.tvId).then(function(response){
      console.log(response);
      self.tmdbId = $routeParams.tvId;
      self.info = response.data;
      self.title = self.info.name;
      self.typesOfSearch.options = self.info.genres;
      /* imdb Id */
      self.tmdb_id = self.info.external_ids.imdb_id;
      return tvTorrents.getTorrentsByImdbId(self.tmdb_id);
    }).then(function(response){
      console.log("Tv Torrents:",response);
      self.torrents = response.data.episodes;
      self.loading = false;
    });
  }

  self.getCast = function(){
    tmdb.getCastFromTvId($routeParams.tvId).then(function(response){
      console.log(response.data);
      self.info.cast = response.data.cast;
      self.info.crew = response.data.crew;
    });
  }

  self.getCrew = function(){
    tmdb.getCastFromTvId($routeParams.tvId).then(function(response){
      console.log(response.data);
      self.info.crew = response.data.crew;
    });
  }


});
