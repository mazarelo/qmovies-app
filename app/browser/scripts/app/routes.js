
myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    replace: true,
    controller:'MainController as intro'
  })
  .when('/tv', {
    templateUrl: 'views/tv.html',
    controller: 'TvController as tvFeed'
  })
  .when('/tv/:tvId', {
    templateUrl: 'views/tv-individual.html',
    controller: 'TvController as tv'
  })
  .when('/tv/:tvId/season/:season', {
    templateUrl: 'views/feed.html',
    controller: 'TvController as tv'
  })
  .when('/tv/:tvId/season/:season/episode/:episode', {
    templateUrl: 'views/feed.html',
    controller: 'TvController as tv'
  })
  .when('/movies', {
    templateUrl: 'views/movies.html',
    controller: 'MoviesController as movieFeed'
  })
  .when('/movies/:movieId', {
    templateUrl: 'views/movies-individual.html',
    controller: 'MoviesController as movie'
  })
  .otherwise({
    redirectTo: "/"
  });

 /* $locationProvider.html5Mode(true); */
});