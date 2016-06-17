
myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller:'MainController as intro'
  })
  .when('/tv', {
    templateUrl: 'views/tv.html',
    controller: 'TvController'
  })
  .when('/movies', {
    templateUrl: 'views/movies.html',
    controller: 'MoviesControllers'
  })
  .otherwise({
    redirectTo: "/"
  });

 /* $locationProvider.html5Mode(true); */
});
