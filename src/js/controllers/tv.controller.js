myApp.controller("TvController" , function( $scope, tmdb , window , folder , $routeParams , qmovies , eztvapi , webTorrent , dates , $rootScope) {
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
    /*
    eztvapi.getFeed(self.page).then(function(response){
      var results = response.data;
      var feed= {
         data:{
           results:[]
         }
       };

      //console.log(response.data);
      results.forEach(function(item){
        feed.data.results.push({id :item._id, year:item.year , name:item.title, vote_average :0,backdrop_path:item.images.poster});
      });
      self.dataResults = feed.data.results;
      console.log(response);
      self.loading = false;
      self.requestRunning = false;
    });
    */
    tmdb.tvFeed(self.list.value , self.page).then(function(response){
      self.dataResults = response.data.results;
      self.loading = false;
      self.requestRunning = false;
      folder.createJsonFile( process.env.DOWNLOAD_PATH+"downloads/json/tvfeed-"+self.list.value, JSON.stringify( { page:self.page ,results: self.dataResults } , null, 4) );
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
          folder.createJsonFile( "downloads/json/tvfeed-"+self.list.value, JSON.stringify( {page:self.page,results: self.dataResults }, null, 4) );
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
  }

  self.getSeasonInfo = function($event ,season){
    self.season = season;
    self.loading = true;
    self.tvId = ($routeParams.tvId ? $routeParams.tvId : "");

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
    tmdb.tvSerie().then(function(response){
      self.info = response.data;
      self.imdb = self.info.external_ids.imdb_id;
      /* query Qmovies for links */
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

      /*
      eztvapi.getSerieInfo(self.imdb).then(function(response){
        console.log("Serie info:",response);
        self.download = '480p';
        self.torrents = response.data.episodes[0].torrents;
        self.loading = false;
      });
      */
      /*
      eztv.query(self.info.name , $routeParams.season , $routeParams.episode , self.imdb ).then(function(data){
          self.torrents = data;
          //self.loading = false;
          //self.torrents = {"Q480":{0:{magnet: data["480p"].url}}};
          console.log(data);
          self.loading = false;
      });
      */

      /*qmovies.getTvTorrents(self.info.name , $routeParams.season , $routeParams.episode ).then(function(response){
          console.log(response.data);
          self.torrents = response.data;
          self.loading = false;
      });*/

    });
  }

  self.playTorrent = function(){
    self.loading = true;
    //let hash = `magnet:?xt=urn:btih:${magnet}&dn=${self.info.name}&tr=http://track.one:1234/announce&tr=udp://track.two:80&rt=`;
    let link = self.download;

    document.getElementById("player").innerHTML = `<iframe src="${link}" width="100%" frameborder="0" allowfullscreen></iframe>`;
    self.loading = false;
    document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
    document.querySelector(".info-content").style.visibility = "hidden";
    //hash = hash.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i);
  /*  webTorrent.play(hash).then(function(response){
      $scope.Title = response;
      self.loading = false;
    });
    */
  };

});
