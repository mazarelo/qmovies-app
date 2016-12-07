/* login */
myApp.controller("MenuController" , function( $scope , $routeParams ) {
  const self = this;

  self.menuItems = {
    active:"",
    options:[
      { name: "Movies", href:"#/movies" },
      { name: "Tv Series", href:"#/tv-series" },
      { name: "Local", href:"#/local" }
    ]
  }

  this.openSettings = function(){
    $scope.showModal = true;
    document.getElementById("modal-12").classList.add("md-show");
    console.log("show modal:", $scope.showModal);
  }
});
