
myApp.service('mpft', function( $q , $routeParams ){

const FindTorrent = require('machinepack-findtorrent');

  this.query = function(title , season=1 , episode=1){
    var deferred = $q.defer();
    // Query EZTV Torrents.
    FindTorrent.queryAll({
      query: 'Walking dead S05E02'
      }).exec({
      // An unexpected error occurred.
      error: function (err){
       console.log('error', err);
      },
      // OK.
      success: function (data){
       deferred.resolve(data);
      },
    });
        return deferred.promise;
    };
   
});
