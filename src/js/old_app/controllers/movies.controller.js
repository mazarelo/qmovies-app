myApp.controller("MoviesController" , function( $scope, webTorrent , yify , $routeParams , window , $window  , $route , notifications) {
  const self = this;
  self.download;
  self.loading = true;
  self.torrents;
  self.requestRunning = false;
  self.errDescription = "Failed to connect";
  self.currentSearch = "getFeed";
  self.sortBy = {
    value: "latest",
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

   self.query = "";
   self.genre = {
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
           /*{name: 'Romance',value: 'Romance'},*/
           {name: 'Film-Noir',value: 'Film-Noir'},
           {name: 'Family',value: 'Family'},
           /*{name: 'Sport',value: 'Sport'},*/
           {name: 'War',value: 'War'},
           {name: 'Sci-fi',value: 'Sci-fi'},
           {name: 'Thriller',value: 'Thriller'},
           {name: 'Western',value: 'Western'},
           {name: 'Drama',value: 'Drama'},
           {name: 'Fantasy',value: 'Fantasy'}
          ]
        };

  self.addToFavorite = function(){
    alert(added);
  }

   self.newWindow = function(id){
     window.open("movies" , id);
   }

   self.querySearch = function(){
     self.loading = true;
   
     yify.querySearch(self.query).then(function(response){
        self.dataResults = response.data.data.movies;
     }, function(err){
       console.log("error", err);
       if(err.status == -1){
         self.errDescription = "Failed to connect";
       }
     });
     self.loading = false;
   }

   self.reloadPage = function(){
     $route.reload();
   }

   /* main feed */
  self.feedDetails = function(){
    self.loading = true;
    
    yify.listMovies( self.sortBy.value , self.genre.value, self.query).then(function(response){
      console.log(response);
      try{
        self.dataResults = response.data.data.movies;
      }catch(err){
        console.log(err);
      }
    }, function(err){
      console.log("error", err);
      self.dataResults = "";
    });
    self.loading = false;
  }
});
