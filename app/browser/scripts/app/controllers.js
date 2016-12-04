/* login */
myApp.controller("AltMenuController" , function( $scope , $routeParams ) {
  const self = this;
  self.typesOfSearch = {
    active:'',
    options:[
      {name:"Test", value:"that"}
    ]
  }

});

/* login */
myApp.controller("TvFeedController" , function( $scope , MenuController ) {
  const self = this;
  self.title = "TV";

});

/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , folder ) {
  const self = this;
  self.title = "Local";
  self.page = 1;

  self.listAllFilesOnFolder = function(){
    folder.listAll().then(function(response){
      console.log(response);
    });
  }

  self.getFeed = function(){
    /* load folder inside downloads and show them. For each file, load a query
    to tmdb and show the information. Use cache if possible to display results
    */
    console.log("Query to Local Files");
  };

});

/* login */
myApp.controller("MenuController" , function( $scope , $routeParams ) {
  const self = this;

  self.menuItems = {
    active:"",
    options:[
      {name: "Movies", href:"#/movies"},
      {name: "Tv Series", href:"#/tv-series"},
      {name: "Animes", href:"#/animes"},
      {name: "Local", href:"#/local"}
    ]
  }
  

});

/* login */
myApp.controller("MovieController" , function( $scope , $routeParams , tmdb ) {
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
    tmdb.movieFeed(type, self.page).then(function(response){
      console.log(response);
      self.results = response.data.results;
      self.tmdbImgUrl = tmdb.imgRoute;
    });
  }

});

/* login */
myApp.controller("TitleController" , function( $scope ) {
  const self = this;
  self.title = "tested this title";

});

/* login */
myApp.controller("TvController" , function( $scope , $routeParams , tmdb , cache) {
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

    if(type !== self.typesOfSearch.active){
      self.typesOfSearch.active = type;
      self.page = 1;
    }
    self.tmdbImgUrl = tmdb.imgRoute;

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



});

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
