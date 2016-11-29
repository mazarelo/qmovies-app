/* login */
myApp.controller("MenuController" , function( $scope , $routeParams ) {
  const self = this;

  self.menuItems = [
    {name: "MOVIES", href:"#/movies"},
    {name: "TV SERIES", href:"#/tv-series"},
    {name: "ANIMES", href:"#/animes"},
    {name: "LOCAL", href:"#/local"}
  ]

});
