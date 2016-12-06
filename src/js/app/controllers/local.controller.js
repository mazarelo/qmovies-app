/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , fileSystem, notifications ) {
  const self = this;
  self.title = "Saved Files";
  self.tvHasFiles = true;
  self.moviesHasFiles = true;
  self.tmdbImgUrl = tmdb.imgRoute;

  self.typesOfSearch = {
    active: "",
    options:""
  }

  self.getFeedTv = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    console.log("Tv Files:",self.filesInFolderTv);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("You havent download any Tv Serie...", "", "Qmovies", "");
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
      notifications.new("You havent download any Movies...", "", "Qmovies", "");
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
