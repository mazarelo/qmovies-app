myApp.service('yify', function($http){

  const listMovies = "http://yify.is/api/v2/list_movies.json";
  const movieDetails = "http://yify.is/api/v2/movie_details.json";

  this.listMovies = function( sortBy, genre ){
    return $http.get(`${listMovies}?&genre=${genre}&sort_by=${sortBy}&limit=50`);
  }

  this.querySearch = function(query){
    return $http.get(`${listMovies}?query_term=${query}`);
  }


  this.movieDetails = function( id ){
    return $http.get(`${movieDetails}?movie_id=${id}&with_images=true&with_cast=true`);
  }

});