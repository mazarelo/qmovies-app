myApp.controller("TvController" , function( $scope, tmdb , window , kat, webTorrent ) {
  this.page = 1;
  this.torrents;
  this.download;

  this.data = {
      value: "on_the_air",
      options: [
        {name: "Latest", value: "latest"},
        {name: "On the air", value: "on_the_air"},
        {name: "Airing today", value: "airing_today"},
        {name: "Top rated", value: "top_rated"},
        {name: "Most popular", value: "popular"}
      ]
  }

  this.getFeed = function(type , page){
    tmdb.tvFeed(type , page).then(function(response){
      $scope.dataResults = response.data.results;
      console.log(response.data.results);
      return response.data.results;
    });
  }

  this.newWindow = function(url){
    console.log("clicked");
    window.open("tv",url);
  }

  this.getTvData = function(){
    tmdb.tvSerie().then(function(response){
      console.log(response.data);
      $scope.tvInformation = response.data;

      kat.query($scope.tvInformation.name).then(function(response){
        console.log(response);
        $scope.torrents = response;
      });
    });
  }

  this.playTorrent = function(magnet){
    // Yes it is
    let hash = `magnet:?xt=urn:btih:${magnet}&dn=${$scope.tvInformation.name}&tr=http://track.one:1234/announce&tr=udp://track.two:80&rt=`;
  webTorrent.play(hash).then(function(response){
      console.log(response);
      $scope.Title = response;
    });
  };


});
