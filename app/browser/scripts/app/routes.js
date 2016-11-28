
myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    replace: true,
    controller:'MainController as intro',
    resolve: {

    }
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController as login',
    resolve: {

    }
  })
  .when('/register', {
    templateUrl: 'views/register.html',
    controller: 'RegisterController as register',
    resolve: {

    }
  })
  .when('/tv', {
    templateUrl: 'views/tv-alternative.html',
    controller: 'TvController as tvFeed',
    resolve: {

    }
  })
  .when('/tv/:tvId/season/:season', {
    templateUrl: 'views/tv-main.html',
    controller: 'TvController as tv',
    resolve: {

    }
  })
  .when('/tv/:tvId/season/:season/episode/:episode', {
    templateUrl: 'views/tv-individual.html',
    controller: 'TvPlayController as tv',
    resolve: {

    }
  })
  .when('/movies', {
    templateUrl: 'views/movies.html',
    controller: 'MoviesController as movieFeed',
    resolve: {

    }
  })
  .when('/movies/:movieId', {
    templateUrl: 'views/movies-individual.html',
    controller: 'MoviesController as movie',
    resolve: {

    }
  })
  .otherwise({
    redirectTo: "/"
  });

 /* $locationProvider.html5Mode(true); */
});
