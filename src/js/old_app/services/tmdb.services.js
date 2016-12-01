myApp.service('tmdb', function($http , folder , $routeParams , cache){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";

  this.fetchTmdb = function(platform = "tv", type , query , page){
    console.log(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
    return $http.get(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
  }

  this.searchByTmbdId = function(id){
    console.log(`${url}/tv/${id}?${apiKey}`);
    let url = `${url}/tv/${id}?${apiKey}`;
    return $http.get(url);
  }

  this.searchByImdbId = function(imdbId){
    console.log(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    let url =`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`
    return $http.get(url);
  }

  this.tvFeed = function(type , page){

    let url = `${url}/tv/${type}?${apiKey}&page=${page}`;
    let storageId = type+page;
    console.log("ID:" storageId);
    if(cache.get(type+page)){
      console.log("Local Storage:",cache.get(type+page));
      return cache.get(type+page);
    }else{
      $localStorage.[type+page] = $http.get(url);
      return $http.get(url);
    }
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${url}/tv/${$routeParams.tvId}/external_ids`);
  }

  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    let url =`${url}/tv/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`;
    return $http.get(url);
  }

  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${url}/tv/${id}/season/${$routeParams.season}?${apiKey}`);
    let url = `${url}/tv/${id}/season/${season}?${apiKey}`;
    return $http.get(url);
  }

  this.tvEpisode = function(){
    console.log(`${url}/tv/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`);
    let url = `${url}/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`;
    return $http.get();
  }

  this.tvDiscover = function (...terms){
    //airDateMin="1980-01-01" ,airDateMax="2016-06-20" , firstReleaseMin="1980-01-01" , firstReleaseMax="2016-06-20" , year=2016 , page=1 , sortBy="popularity.desc" ,voteMin=0 ,voteMax=10 , genre
      var termArray = [];
        terms.forEach(function (item) {
          termArray.push(item);
        });
        console.log(`${url}/discover/tv?${termArray.join("&")}&${apiKey}`);
        let url = `${url}/discover/tv?${termArray.join("&")}&${apiKey}`;
    return $http.get(url);
  }

  this.tvSearch = function(query , page ){
    let url = `${url}/search/tv?query=${query}&page=${page}&${apiKey}`;
    return $http.get(url);
  }

  this.movieSearch = function(query , page ){
    let url = `${url}/search/movies?query=${query}&page=${page}&${apiKey}`;
    return $http.get(url);
  }
});
