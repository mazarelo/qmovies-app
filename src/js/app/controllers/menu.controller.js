/* login */
myApp.controller("MenuController" , function( $scope , $routeParams ) {
  const self = this;

  self.menuItems = {
    active:"",
    options:[
      {name: "Movies", href:"#/movies"},
      {name: "Tv Series", href:"#/tv-series"},
      {name: "Local", href:"#/local"}
    ]
  }

});
