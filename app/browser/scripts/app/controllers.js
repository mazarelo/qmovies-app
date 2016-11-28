/* login */
myApp.controller("LoginController" , function( $scope ) {
  const self = this;
  self.pageName = "Login";
});

myApp.controller("MainController" , function( $scope ) {
  const self = this;
  self.pageName = "Dope";
  self.MovieTitle = "Loading Title";
});

myApp.controller("MenuController" , function( $scope, window ) {

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

myApp.controller("MoviesController" , function( $scope, webTorrent , yify , $routeParams , window , $window  , $route , notifications) {
  const self = this;
  self.download;
  self.loading = true;
  self.torrents;
  self.requestRunning = false;
  self.errDescription = "Failed to connect";
  self.currentSearch = "getFeed";
  self.sortBy = {
    value: "latest",
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
           /*{name: 'Romance',value: 'Romance'},*/
           {name: 'Film-Noir',value: 'Film-Noir'},
           {name: 'Family',value: 'Family'},
           /*{name: 'Sport',value: 'Sport'},*/
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

   self.newWindow = function(id){
     window.open("movies" , id);
   }

   self.querySearch = function(){
     self.loading = true;
   
     yify.querySearch(self.query).then(function(response){
        self.dataResults = response.data.data.movies;
     }, function(err){
       console.log("error", err);
       if(err.status == -1){
         self.errDescription = "Failed to connect";
       }
     });
     self.loading = false;
   }

   self.reloadPage = function(){
     $route.reload();
   }

   /* main feed */
  self.feedDetails = function(){
    self.loading = true;
    
    yify.listMovies( self.sortBy.value , self.genre.value, self.query).then(function(response){
      console.log(response);
      try{
        self.dataResults = response.data.data.movies;
      }catch(err){
        console.log(err);
      }
    }, function(err){
      console.log("error", err);
      self.dataResults = "";
    });
    self.loading = false;
  }
});

myApp.controller("MoviesPlayController" , function( $scope, webTorrent , yify , $routeParams , window , $window  , $route) {
  const self = this;
  
  /* removes torrents on exiting the window */
  $scope.$on('$locationChangeStart', function( event ) {
    event.preventDefault();
    webTorrent.stopAllTorrents();
    history.back();
  });
  
  self.playTorrent = function(){
    self.loading = true;
    $scope.MovieTitle = "waiting";
    webTorrent.play(self.download).then(function(response){
      $scope.MovieTitle = response;
      self.loading = false;
    });
  };

  self.movieDetails = function(){
    self.loading = true;
    yify.movieDetails($routeParams.movieId).then(function(response){
      console.log(response);
      /* return if no data */
      if(!response.data) {
        $window.history.back();
        return;
      }
      if(Array.isArray(response.data.data.torrents.torrent)){
        self.torrents = response.data.data.torrents.torrent;
        self.download = self.torrents[0].url;
        console.log(response);
      }else{
        /* If there is 1 or more torrents problem fix */
        self.torrents = ( response.data.data.torrents.torrent.url ? [response.data.data.torrents.torrent] :response.data.data.torrents.torrent);
      }

      self.info = response.data.data;
      self.loading = false;
    });
  };

});

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

myApp.controller("VideoController" , function( $scope, $routeParams ) {

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
