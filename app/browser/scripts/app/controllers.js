myApp.controller("MainController" , function( $scope, folder, webTorrent ) {
  const self = this;
  self.pageName = "Dope";
  self.MovieTitle = "Loading Title";
});

myApp.controller("MenuController" , function( $scope, window ) {
  console.log("menu initialized");

  this.minimize = function(){
     window.minimize();
  }
  this.maximize = function(){
     window.maximize();
  }
  this.close = function(){
     window.close();
  }
});

myApp.controller("MoviesController" , function( $scope, webTorrent , yify , $routeParams , window ) {
  const self = this;
  self.download;
  self.loading = true;
  self.sortBy = {
    value: "year",
    options: [
      {value: 'title', name: 'Title'},
      {value: 'year', name: 'Year'},
      {value: 'rating', name: 'Rating'},
      {value: 'peers', name: 'peers'},
      {value: 'seeds', name: 'seeds'},
      {value: 'download_count', name: 'Most Popular'},
      {value: 'like_count', name: 'Most Voted'},
      {value: 'date_added', name: 'Recently added'}
    ]
   };

   self.query = "";
   self.genre = {
        value: "Sci-fi",
        options: [
           {name: 'Action', value: 'action'},
           {name: 'Adventure', value: 'Adventure'},
           {name: 'Biography',  value: 'Biography'},
           {name: 'Crime', value: 'Crime'},
           {name: 'Documentary', value: 'Documentary'},
           {name: 'Comedy',value: 'Comedy'},
           {name: 'Animation',value: 'Animation'},
           {name: 'Horror',value: 'Horror'},
           {name: 'Musical',value: 'Musical'},
           {name: 'Romance',value: 'Romance'},
           {name: 'Film-Noir',value: 'Film-Noir'},
           {name: 'Family',value: 'Family'},
           {name: 'Sport',value: 'Sport'},
           {name: 'War',value: 'War'},
           {name: 'Sci-fi',value: 'Sci-fi'},
           {name: 'Thriller',value: 'Thriller'},
           {name: 'Western',value: 'Western'},
           {name: 'Drama',value: 'Drama'},
           {name: 'Fantasy',value: 'Fantasy'}
          ]
        };

  self.addToFavorite = function(){
    alert(added);
  }

   self.moviesData = function(){
     self.loading = true;
     yify.listMovies(self.sortBy.value , self.genre.value , self.query).then(function(response){
       console.log(response.data.data.movies);
       self.dataResults = response.data.data.movies;
       self.loading = false;
     });
   };

   self.newWindow = function(id){
     window.open("movies" , id);
   }

  self.feedDetails = function(){
    self.loading = true;
    yify.listMovies(self.sortBy.value , self.genre.value, self.query).then(function(response){
      console.log(response.data.data.movies);
      self.dataResults = response.data.data.movies;
      self.loading = false;
    });
  }

  self.playTorrent = function(magnet){
    $scope.MovieTitle = "waiting";
    // Yes it is
    webTorrent.play(magnet).then(function(response){
      console.log(response);
      $scope.MovieTitle = response;
      self.loading = false;
    });
  };

  self.movieDetails = function(){
    self.loading = true;
    yify.movieDetails($routeParams.movieId).then(function(response){
      console.log(response.data.data);
      self.info = response.data.data;
      self.loading = false;
    });
  };

});

myApp.controller("TvController" , function( $scope, tmdb , window , kat, webTorrent  , $rootScope) {
  const self = this;
  self.page = 1;
  self.requestRunning = false;
  self.loading = true;
  window.tvSubMenu;
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
          { value: "popularity.desc", name: "Popularity" },
          { value: "release_date.desc", name: "Release Date" },
          { value: "revenue.desc", name: "Revenue" },
          { value: "primary_release_date.desc", name: "Year" },
          { value: "original_title.asc", name: "Title" },
          { value: "vote_average.desc", name: "Rate" },
          { value: "vote_count.desc", name: "Most Voted" }
        ]
      }

  self.getFeed = function(type){
    tmdb.tvFeed(type , self.page).then(function(response){
      self.dataResults = response.data.results;
      console.log(response.data.results);
      self.loading = false;
    });
  }

  self.newWindow = function(url){
    console.log("clicked");
    window.open("tv",url);
  }

  self.loadMore = function(){
    self.loading = true;
    tmdb.tvDiscover(`first_air_date_year=${self.years.value}` , `sort_by=${self.sortBy.value}` , `with_genres=${self.genre.value}` , `page=${self.page}` ).then(function(response){
      if(response.data.results.length === 0){
        return self.requestRunning = true;
      }else{
        response.data.results.forEach( function (arrayItem){
          self.dataResults.push(arrayItem);
        });
        self.requestRunning = false;
        self.loading = false;
      }
    });
  }

  
  self.activateZoom = function(element){
    let target = element;
    console.log(target);
    return target;
  }

  self.discover = function(){
    self.loading = true;
    tmdb.tvDiscover(`first_air_date_year=${self.years.value}` ,  `sort_by=${self.sortBy.value}` , `with_genres=${self.genre.value}` , `page=${self.page}` ).then(function(response){
      self.dataResults = response.data.results;
      self.requestRunning = false;
      self.page = 1;
      self.loading = false;
    });
  }

  self.search = function(){
    self.loading = true;
    tmdb.tvSearch(`${self.query}`, self.page).then(function(response){
      console.log(response.data.results);
      self.dataResults = response.data.results;
      self.loading = false;
    });
  }

  self.getTvData = function(){
    self.loading = true;
    tmdb.tvSerie().then(function(response){
      console.log(response.data);
      self.info = response.data;
      kat.query(self.info.name).then(function(response){
        console.log(response);
        self.torrents = response;
        self.loading = false;
      });
    });
  }

  self.playTorrent = function(magnet){
    // Yes it is
    let hash = `magnet:?xt=urn:btih:${magnet}&dn=${self.info.name}&tr=http://track.one:1234/announce&tr=udp://track.two:80&rt=`;
    webTorrent.play(hash).then(function(response){
      $scope.Title = response;
    });
  };
});

myApp.controller("VideoController" , function( $scope, webTorrent , yify , $routeParams ) {

  const self = this;

  self.checkStatus = function(){
    let video = document.getElementsByTagName("video");
    if(video.paused){
      self.checkStatus = false;
    }else{
      self.checkStatus = true;
    }
  };

  self.pause = function() {
      let video = document.getElementsByTagName("video");
      video[0].pause();
  }

  self.play = function(){
    let video = document.getElementsByTagName("video");
    if (video[0].paused) {
      video[0].play();
    } else {
      video[0].pause();
    }
  //  video[0].play();
  }

  self.stop = function(){
    let video = document.getElementsByTagName("video");
    video[0].currentTime = 0;
    video[0].pause();
  }

  self.fullScreen = function(){
    let video = document.getElementsByTagName("video");
    if(video[0].webkitEnterFullscreen){
			video[0].webkitEnterFullscreen();
		}
  }

});
