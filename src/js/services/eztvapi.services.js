/* GET LIST OF SERIES */
//https://eztvapi.ml/shows/{page}

/* GET SERIE ID TORRENTS AND INFO */
//https://eztvapi.ml/show/{serieId}



myApp.service('eztvapi', function($http , $routeParams ){

  const self = this;
  const apiUrl = "https://eztvapi.ml";

  self.getTotalPages = function(){
    return $http.get(`${apiUrl}/shows`);
  }

  self.getFeed = function(page){
    return $http.get(`${apiUrl}/shows/${page}`);
  };

  self.getSerieInfo = function(){
    return $http.get(`${apiUrl}/show/${$routeParams.tvId}`);
  }

  self.getSerieSeason = function(){

  }
  
});
