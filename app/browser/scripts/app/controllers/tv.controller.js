myApp.controller("TvController" , function( $scope, tmdb , window , qmovies,eztv , webTorrent , dates , $rootScope) {
  const self = this;
  self.page = 1;
  self.requestRunning = false;
  self.torrents =[];
  self.loading = true;
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

      tmdb.tvFeed(self.list.value , self.page).then(function(response){
        self.dataResults = response.data.results;
        self.loading = false;
        self.requestRunning = false;
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
          self.requestRunning = false;
          self.loading = false;
        };
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

    /* kick ass torrent scrapper 
    kat.query(self.info.name , self.season ,episode ).then(function(response){
      self.torrents = response;
      self.loading = false;
      try{
        self.info.backdrop_path = self.seasonData.episodes[self.episode].still_path;
      }catch(err){
        console.log(err);
      }
    });
    */

    eztv.query(self.info.name , self.season , episode , self.imdb ).then(function(data){
      //self.torrents.push(data);
      //self.loading = false;
      self.torrents = {"Q480":{0:{magnet: data["480p"].url}}};
      console.log(self.torrents);
    });

   qmovies.getTvTorrents(self.info.name , self.season , episode).then(function(response){
      console.log(response.data);
      self.torrents = response.data;
      self.loading = false;
    });
  }

  self.getSeasonInfo = function($event ,season){
    self.season = season;
    self.loading = true;
    let seasons = document.getElementsByClassName("season-btn");
    for(let i=0;i<seasons.length;i++){
      let classes = seasons[i].className.replace('active','');
      seasons[i].className = classes;
    }

    $event.target.classList.toggle("active");
    tmdb.tvSeason(season).then(function(response){
      self.seasonData = response.data;
      self.loading = false;
    });
  }

  self.getTvData = function(){
    self.loading = true;
    tmdb.tvSerie().then(function(response){
      self.info = response.data;
      console.log("tv data ");
      console.log(self.info);
      self.season = 1;
      self.imdb = self.info.external_ids.imdb_id;
      self.episode = 1;
      self.getSeasonsNumber = function(num) {
        return new Array(num);
      }
    });

    tmdb.tvSeason().then(function(response){
      self.seasonData = response.data;
      console.log(self.seasonData);
      self.loading = false;
    });

  }

  self.playTorrent = function(magnet){
    //let hash = `magnet:?xt=urn:btih:${magnet}&dn=${self.info.name}&tr=http://track.one:1234/announce&tr=udp://track.two:80&rt=`;
    let hash = self.download;
    //hash = hash.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i);
    console.log(hash);
    
    try{
      webTorrent.play(hash).then(function(response){
        $scope.Title = response;
        self.loading = false;
      });
    }catch(err){
      console.log(err);
    }
 
  };
});
