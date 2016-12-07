myApp.service('tmdb', function($http , $routeParams , $q , cache ){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";
  const self = this;

  this.api = {
    key: "api_key=7842e553f27c281212263c594f9504cf",
    endPoint: "https://api.themoviedb.org/3",
    personUrl: "https://api.themoviedb.org/3/person/",
    imgUrl: "http://image.tmdb.org/t/p/"
  }

  this.imgRoute = {
      w150: self.api.imgUrl+"w300",
      w300: self.api.imgUrl+"w300",
      w500: self.api.imgUrl+"w500",
      w1920: self.api.imgUrl+"w1920"
  };
  /* defered kit
  var deferred = $q.defer();
  deferred.resolve(data);
  return deferred.promise;
  */

  /* NEEDS WORK ON IT! FIND A WAY OF STORING FILES IF NOT STORED ON THE SERVICES LEVEL */
  this.fetchTmdb = function(platform = "tv", type , query , page){
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
       return $http.get(`${this.api.endPoint}/${type}?${query}&${this.api.key}&${this.api.key}&page=${page}`)
    }
    return deferred.promise;
    //console.log(`${this.api.endPoint}/${type}?${query}&${this.api.key}&${this.api.key}&page=${page}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}?${this.api.key}&append_to_response=external_ids`);
  }

  this.getCastFromTvId = function(tvId){
    console.log(`${this.api.endPoint}/tv/${tvId}/credits?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${tvId}/credits?${this.api.key}`);
  }

  this.searchByImdbId = function(imdbId){
    console.log(`${this.api.endPoint}/find/${$routeParams.tvId}?${this.api.key}&language=en-US&external_source=imdb_id`);
    return $http.get(`${this.api.endPoint}/find/${$routeParams.tvId}?${this.api.key}&language=en-US&external_source=imdb_id`);
  }

  this.tvFeed = function(type , page){
    //console.log(`${this.api.endPoint}/tv/${type}?${this.api.key}&page=${page}`);
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    /*if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
    */
      return $http.get(`${this.api.endPoint}/tv/${type}?${this.api.key}&page=${page}`);
    /*}*/

    return deferred.promise;
  }

  this.movieFeed = function(type , page){
    console.log(`${this.api.endPoint}/movie/${type}?${this.api.key}&page=${page}`);
    return $http.get(`${this.api.endPoint}/movie/${type}?${this.api.key}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${this.api.endPoint}/tv/${$routeParams.tvId}/external_ids?${this.api.key}`);
  }

  this.tvSerie = function(){
    console.log(`${this.api.endPoint}/tv/${$routeParams.tvId}?${this.api.key}&append_to_response=external_ids`);
    return $http.get(`${this.api.endPoint}/tv/${$routeParams.tvId}?${this.api.key}&append_to_response=external_ids`);
  }

  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${this.api.endPoint}/tv/${id}/season/${season}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}/season/${season}?${this.api.key}`);
  }

  this.tvEpisode = function(){
    console.log(`${this.api.endPoint}/tv/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${this.api.key}`);
  }

  this.tvDiscover = function (...terms){
    //airDateMin="1980-01-01" ,airDateMax="2016-06-20" , firstReleaseMin="1980-01-01" , firstReleaseMax="2016-06-20" , year=2016 , page=1 , sortBy="popularity.desc" ,voteMin=0 ,voteMax=10 , genre
      var termArray = [];
        terms.forEach(function (item) {
          termArray.push(item);
        });
        console.log(`${this.api.endPoint}/discover/tv?${termArray.join("&")}&${this.api.key}`);
    return $http.get(`${this.api.endPoint}/discover/tv?${termArray.join("&")}&${this.api.key}`);
  }

  this.tvSearch = function(query , page ){
    return $http.get(`${this.api.endPoint}/search/tv?query=${query}&page=${page}&${this.api.key}`);
  }

  this.movieSearch = function(query , page ){
    return $http.get(`${this.api.endPoint}/search/movies?query=${query}&page=${page}&${this.api.key}`);
  }
});
