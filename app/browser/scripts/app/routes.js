
myApp.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    replace: true,
    controller:'',
    resolve: {

    }
  })
  .when('/movies', {
    templateUrl: 'views/movie_feed.html',
    controller: 'MovieController as movies',
    resolve: {

    }
  })
  .when('/local', {
    templateUrl: 'views/local.html',
    controller: 'LocalController as local',
    resolve: {

    }
  })
  .when('/tv/:tvId', {
    templateUrl: 'views/tv.html',
    controller: 'TvMainController as tv',
    resolve: {

    }
  })
  .when('/tv-series', {
    templateUrl: 'views/tv_feed.html',
    controller: 'TvController as tv',
    resolve: {

    }
  })
  .otherwise({
    redirectTo: "/"
  });

 /* $locationProvider.html5Mode(true); */
});
