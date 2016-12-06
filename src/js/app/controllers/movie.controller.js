/* login */
myApp.controller("MovieController" , function( $scope , $routeParams , tmdb, $rootScope, notifications ) {
  const self = this;
  self.title = "Movies";
  self.page = 1;

  /* changes sub-menu links dinamicly */
  self.typesOfSearch = {
    active:'popular',
    options:[
      {name: "Most Popular",value: "popular"},
      {name: "Top Rated", value: "top_rated"},
      {name: "Watch list", value: "watch list"}
    ]
  }

  self.getFeed = function(type = self.typesOfSearch.active){
    /* if offline tell user to connect */
    if(!$rootScope.online) notifications.new("Please re-connect to the internet!", "","No internet!"); return;

    tmdb.movieFeed(type, self.page).then(function(response){
      console.log(response);
      self.results = response.data.results;
      self.tmdbImgUrl = tmdb.imgRoute;
    });
  }

});
