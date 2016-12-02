/* login */
myApp.controller("LocalController" , function( $scope , $routeParams , tmdb , folder ) {
  const self = this;
  self.title = "Local";
  self.page = 1;

  self.listAllFilesOnFolder = function(){
    folder.listAll().then(function(response){
      console.log(response);
    });
  }

  self.getFeed = function(){
    /* load folder inside downloads and show them. For each file, load a query
    to tmdb and show the information. Use cache if possible to display results
    */
    console.log("Query to Local Files");
  });

});
