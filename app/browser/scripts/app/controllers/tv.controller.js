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
  self.playEpisode = function(episode){

    console.log("name:"+self.info.name);
    console.log("episode:"+episode);
    console.log("season:"+self.season);

    kat.query(self.info.name , self.season ,episode ).then(function(response){
      console.log(response);
      self.torrents = response;
      self.loading = false;
    });
  }
  self.getSeasonInfo = function($event ,season){
    self.season = season;
    let seasons = document.getElementsByClassName("season-btn");
    for(let i=0;i<seasons.length;i++){
      let classes = seasons[i].className.replace('active','');
      seasons[i].className = classes;
    }
    $event.target.classList.toggle("active");
    tmdb.tvSeason(season).then(function(response){
      self.seasonData = response.data;
      console.log(self.seasonData);
    });
  }
  self.getTvData = function(){
    self.loading = true;
    tmdb.tvSerie().then(function(response){
      console.log(response.data);
      self.info = response.data;
      self.season = 1;
      self.getSeasonsNumber = function(num) {
        return new Array(num);
      }
    });
    tmdb.tvSeason().then(function(response){
      self.seasonData = response.data;
      console.log(self.seasonData);
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
