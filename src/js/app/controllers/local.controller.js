/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , fileSystem, notifications ) {
  const self = this;
  self.title = "Saved Files";
  self.noFiles = false;
  self.typesOfSearch = {
    active: "",
    options:""
  }

  self.getFeed = function(path){
    self.filesInFolderTv = fileSystem.listAll(path);
    /* if its undefined return */
    if(self.filesInFolderTv == undefined){
      notifications.new("You havent download any Tv Serie...", "", "Qmovies", function(){
        console.log("test");
      });
      self.noFiles = true;
      return false
    }
    /* fetch files and get metadata */
    self.results = [];
    self.filesInFolderTv.forEach(function(item){
      tmdb.searchById(item).then(function(response){
        self.results.push(response.data);
      });
    })
  }



});
