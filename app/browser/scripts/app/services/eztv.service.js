myApp.service('eztv', function( $q , $routeParams ){

  this.query = function(title , season=1 , episode=1){
    var deferred = $q.defer();
    // search for game of thrones season 1 episode 2 with all scrapers
  //deferred.resolve(results);
      return deferred.promise;
    };
});
