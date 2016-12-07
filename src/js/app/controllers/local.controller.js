/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , fileSystem, notifications ) {
  const self = this;
  self.title = "OFFLINE FILES";
  self.tvHasFiles = true;
  self.moviesHasFiles = true;
  self.tmdbImgUrl = tmdb.imgRoute;

  self.typesOfSearch = {
    active: "tv-series",
    options:[
      {name: "Tv series", value:"tv-series"},
      {name: "Movies", value: "movies"}
    ]
  }

  self.getFeed = function(value){
    self.typesOfSearch.active = value;
  }

  self.getFeedTv = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    console.log("Tv Files:",self.filesInFolderTv);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("Your local Tv list is empty...", "", "Qmovies", function(){
        console.log("clicked no series downloaded");
      });
      return false
    }
    self.tvHasFiles = false;

    /* fetch files and get metadata */
    self.results = [];
    self.filesInFolderTv.forEach(function(item){
      tmdb.searchById(item).then(function(response){
        self.results.push(response.data);
      });
    });
    console.log("Results:",self.results);
  }

  self.getFeedMovies = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("Your local Movies list is empty...", "", "Qmovies", function(){
        console.log("clicked no movies downloaded");
      });
      return false
    }
    self.moviesHasFiles = true;
    /* fetch files and get metadata */
    self.results = [];
    self.filesInFolderTv.forEach(function(item){
      tmdb.searchById(item).then(function(response){
        self.results.push(response.data);
      });
      console.log(self.results);
    })
  }

});
