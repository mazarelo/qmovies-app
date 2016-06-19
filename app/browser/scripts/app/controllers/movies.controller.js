myApp.controller("MoviesController" , function( $scope, webTorrent , yify , $routeParams ) {
  this.download;

  this.sortBy = {
    value: "year",
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

   this.query = "";
   this.genre = {
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
           {name: 'Romance',value: 'Romance'},
           {name: 'Film-Noir',value: 'Film-Noir'},
           {name: 'Family',value: 'Family'},
           {name: 'Sport',value: 'Sport'},
           {name: 'War',value: 'War'},
           {name: 'Sci-fi',value: 'Sci-fi'},
           {name: 'Thriller',value: 'Thriller'},
           {name: 'Western',value: 'Western'},
           {name: 'Drama',value: 'Drama'},
           {name: 'Fantasy',value: 'Fantasy'}
          ]
        };

  this.addToFavorite = function(){
    alert(added);
  }

   this.moviesData = function(){
     yify.listMovies(this.sortBy.value , this.genre.value , this.query).then(function(response){
       console.log(response.data.data.movies);
       $scope.dataResults = response.data.data.movies;
       return response.data.data.movies;
     });
   };

   this.newWindow = function(id){
     console.log("clicked");
     window.open("movies",id);
   }

  this.feedDetails = function(){
    yify.listMovies(this.sortBy.value , this.genre.value, this.query).then(function(response){
      console.log(response.data.data.movies);
      $scope.dataResults = response.data.data.movies;
      return response.data.data.movies;
    });
  }

  this.playTorrent = function(magnet){
    $scope.MovieTitle = "waiting";
    // Yes it is
    webTorrent.play(magnet).then(function(response){
      console.log(response);
      $scope.MovieTitle = response;
    });
  };

  this.movieDetails = function(){
    yify.movieDetails($routeParams.movieId).then(function(response){
      console.log(response.data.data);
      $scope.movieInformation = response.data.data;
      return response.data.data;
    });
  };

});
