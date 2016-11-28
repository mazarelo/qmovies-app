myApp.controller("TvController" , function( $scope, tmdb , window , folder , $routeParams , qmovies , eztvapi , webTorrent , dates , $rootScope) {
  const self = this;
  self.page = 1;
  self.requestRunning = false;
  self.torrents =[];
  self.loading = true;
  self.eztvData =3;
  self.download;
  window.tvSubMenu;
  /* get current search */
  self.currentSearch = "getFeed";

  self.lists = {
    value: "on_the_air",
    options: [
      {name: "Latest", value: "latest"},
      {name: "On the air", value: "on_the_air"},
      {name: "Airing today", value: "airing_today"},
      {name: "Top rated", value: "top_rated"},
      {name: "Most popular", value: "popular"}
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

  self.list = {
    value: "popular",
    options: [
      { value: "popular", name: "Popular" },
      { value: "on_the_air", name: "On the Air" },
      { value: "airing_today", name: "Airing Today" },
      { value: "top_rated", name: "Top Rated" }
    ]
  }

  self.getFeed = function(){
    self.page = 1;
    self.requestRunning = false;
    self.loading = true;
    /* scroll feed-ajax to top */
    window.scrollToTop(1000);

    /* Read from Json instead of Requesting new one
    folder.readJson("downloads/json/tvfeed-"+self.list.value).then(function(data){
        self.dataResults = data.results;
        self.page = data.page;
        self.loading = false;
        self.requestRunning = false;
        return true;
    });
    */
    /*
    let episodes = document.getElementsByClassName("episode-btn");
    for(let i = 0 ; i < episodes.length ; i++){
      let classes = episodes[i].className.replace('active','');
      episodes[i].className = classes;
    }

    $event.target.classList.toggle("active");
    */

    /* USING TMDB API
    tmdb.tvFeed(self.list.value , self.page).then(function(response){
      self.dataResults = response.data.results;
      self.loading = false;
      self.requestRunning = false;
      folder.createJsonFile( "downloads/json/tvfeed-"+self.list.value, JSON.stringify( { page:self.page ,results: self.dataResults } , null, 4) );
    }, function(err){
      console.log("error", err);
      self.dataResults = "";
      self.loading = false;
    });
    */
   
    /* USING EZTV API */
    eztvapi.getFeed(self.page).then(function(response){
      console.log("Results:",response.data);
      self.dataResults = response.data;
      self.loading = false;
      self.requestRunning = false;
      folder.createJsonFile("tvfeed-"+self.list.value, JSON.stringify( { page:self.page ,results: self.dataResults } , null, 4) );
    }, function(err){
      console.log("error", err);
      self.dataResults = "";
      self.loading = false;
    });
  }

  self.newWindow = function(url){
    window.open("tv",url);
  }

  self.daysLeft = function(future){
    return dates.daysLeft(future);
  }

  self.loadMore = function(){
    /* activate loaders */
    self.loading = true;
    /* check what function to call */
    if(self.currentSearch == "getFeed"){
      tmdb.tvFeed(self.list.value , self.page).then(function(response){
        if(response.data.results.length === 0){
          return self.requestRunning = true;
        }else{
          response.data.results.forEach( function (arrayItem){
            self.dataResults.push(arrayItem);
          });
          /* saves file to disk */
          folder.createJsonFile( "tvfeed-"+self.list.value, JSON.stringify( {page:self.page,results: self.dataResults }, null, 4) );
          self.requestRunning = false;
          self.loading = false;
        };
      }, function(err){
        console.log("error", err);
        self.loading = false;
      });
    }else if(self.currentSearch = "discover"){
      tmdb.tvDiscover(`sort_by=${self.sortBy.value}` , `with_genres=${self.genre.value}` , `page=${self.page}` ).then(function(response){
        if(response.data.results.length === 0){
          return self.requestRunning = true;
        }else{
          response.data.results.forEach( function (arrayItem){
            self.dataResults.push(arrayItem);
          });
          self.requestRunning = false;
          self.loading = false;
        }
      }, function(err){
        console.log("error", err);
        self.loading = false;
      });
    }else if(self.currentSearch == "search"){
      tmdb.tvSearch(`${self.query}`, self.page).then(function(response){
        if(response.data.results.length === 0){
          return self.requestRunning = true;
        }else{
          self.dataResults = response.data.results;
          self.loading = false;
        }
      });
    }
    self.loading = false;
  }

  self.activateZoom = function(element){
    let target = element;
    return target;
  }

  self.discover = function(){
    self.loading = true;
    self.page = 1;
    /* scroll feed-ajax to top */
    window.scrollToTop(1000);
    tmdb.tvDiscover(`sort_by=${self.sortBy.value}` , `with_genres=${self.genre.value}` , `page=${self.page}` ).then(function(response){
      self.dataResults = response.data.results;
      self.requestRunning = false;
      self.loading = false;
    }, function(err){
      console.log("error", err);
      self.loading = false;
    });
  }

  self.search = function(){
    self.loading = true;
    self.page = 1;
    /* scroll feed-ajax to top */
    if(self.query.length >3){
      window.scrollToTop(1000);
      tmdb.tvSearch(`${self.query}`, self.page).then(function(response){
        self.dataResults = response.data.results;
        self.loading = false;
      }, function(err){
        console.log("error", err);
        self.loading = false;
      });
    }else if(self.query.length <=3){
      self.loading = false;
    }
  }

  self.dateCheck = function(d){
    return dates.compareDates(d);
  }

  self.playEpisode = function($event , episode){
    self.episode = episode;
    let episodes = document.getElementsByClassName("episode-btn");
    for(let i = 0 ; i < episodes.length ; i++){
      let classes = episodes[i].className.replace('active','');
      episodes[i].className = classes;
    }

    $event.target.classList.toggle("active");
  }

  self.getSeasonInfo = function($event ,season){
    self.season = season;
    self.loading = true;
    self.tvId = (self.tmdbId ? self.tmdbId : "");

    let seasons = document.getElementsByClassName("season-btn");
    for(let i=0;i<seasons.length;i++){
      let classes = seasons[i].className.replace('active','');
      seasons[i].className = classes;
    }

    $event.target.classList.toggle("active");
    tmdb.tvSeason(self.tvId ,season).then(function(response){
      self.seasonData = response.data;
      self.loading = false;
    });
  }

  self.getSeasonsNumber = function(num) {
    return new Array(num);
  }

  self.getTvData = function(){
    self.loading = true;
    tmdb.searchByImdbId().then(function(response){
      self.info = response.data.tv_results[0];
      console.log("tv data:", self.info);
      self.season = 1;
      self.tmdbId = self.info.id;
      self.imdb = $routeParams.tvId;
      self.episode = 1;
    })
    .then(function(){
      tmdb.searchByTmbdId(self.tmdbId).then(function(response){
        self.info = response.data;
        console.log("Tmdb:",self.info);
      });
    })
    .then(function(){
      tmdb.tvSeason(self.tmdbId).then(function(response){
        self.seasonData = response.data;
        console.log("Season: ",self.seasonData);
      });
    })
    .then(function(){
      self.loading = false;
    });
  }

});
