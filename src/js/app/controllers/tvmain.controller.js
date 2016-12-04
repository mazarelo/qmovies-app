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
