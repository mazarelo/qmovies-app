myApp.service('tmdb', function($http , $routeParams , $q , cache ){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";

  this.imgRoute = {
      w300: imgUrl+"w300",
      w500: imgUrl+"w500",
      w1920: imgUrl+"w1920"
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
       return $http.get(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`)
    }
    return deferred.promise;
    //console.log(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}&append_to_response=external_ids`);
  }

  this.getCastFromTvId = function(tvId){
    console.log(`${url}/tv/${tvId}/credits?${apiKey}`);
    return $http.get(`${url}/tv/${tvId}/credits?${apiKey}`);
  }

  this.searchByImdbId = function(imdbId){
    console.log(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    return $http.get(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
  }

  this.tvFeed = function(type , page){
    //console.log(`${url}/tv/${type}?${apiKey}&page=${page}`);
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    /*if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
    */
      return $http.get(`${url}/tv/${type}?${apiKey}&page=${page}`);
    /*}*/

    return deferred.promise;
  }

  this.movieFeed = function(type , page){
    console.log(`${url}/movie/${type}?${apiKey}&page=${page}`);
    return $http.get(`${url}/movie/${type}?${apiKey}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${url}/tv/${$routeParams.tvId}/external_ids?${apiKey}`);
  }

  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
    return $http.get(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
  }

  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${url}/tv/${id}/season/${season}?${apiKey}`);
    return $http.get(`${url}/tv/${id}/season/${season}?${apiKey}`);
  }

  this.tvEpisode = function(){
    console.log(`${url}/tv/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`);
    return $http.get(`${url}/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`);
  }

  this.tvDiscover = function (...terms){
    //airDateMin="1980-01-01" ,airDateMax="2016-06-20" , firstReleaseMin="1980-01-01" , firstReleaseMax="2016-06-20" , year=2016 , page=1 , sortBy="popularity.desc" ,voteMin=0 ,voteMax=10 , genre
      var termArray = [];
        terms.forEach(function (item) {
          termArray.push(item);
        });
        console.log(`${url}/discover/tv?${termArray.join("&")}&${apiKey}`);
    return $http.get(`${url}/discover/tv?${termArray.join("&")}&${apiKey}`);
  }

  this.tvSearch = function(query , page ){
    return $http.get(`${url}/search/tv?query=${query}&page=${page}&${apiKey}`);
  }

  this.movieSearch = function(query , page ){
    return $http.get(`${url}/search/movies?query=${query}&page=${page}&${apiKey}`);
  }
});
