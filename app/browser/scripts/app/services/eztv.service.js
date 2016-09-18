myApp.service('eztv', function( $q , $routeParams ){
  const eztv = require('eztv');

  this.query = function(title , season=1 , episode=1){
    var deferred = $q.defer();
    // search for game of thrones season 1 episode 2 with all scrapers
    //deferred.resolve(results);
    eztv.getShows({query: title}, function(error, results) {
      // Do stuff...
      console.log(results);
      console.log(error);
    });
    return deferred.promise;
  };
});
