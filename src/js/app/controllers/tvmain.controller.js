/* login */
myApp.controller("TvMainController" , function( $scope , $routeParams , tmdb , providers, streamin ) {
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
    tmdb.searchByTmbdId($routeParams.tvId).then(function(response){
      console.log(response);
      self.info = response.data;
      self.title = self.info.name;
      self.typesOfSearch.options = self.info.genres;
    });
    /* test url = 'http://streamin.to/2io0duwvz10t' */
    var ts = require('torrent_scraper');
    //serarch for torrents for 'debian 7', 'unix' category on kickasstorrents and '303' category on thepiratebay
    ts.getTorrents('debian 7', { kickasstorrents: 'unix', thepiratebay: '303' }, function(err, torrents){
        console.log(err, torrents)
        console.log("CALLBACK", torrents);
    });
    /*
    providers.filterProviders("http://streamin.to/ekiljfxzks0h").then(function(response){
      console.log(response);
    });
    */
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
