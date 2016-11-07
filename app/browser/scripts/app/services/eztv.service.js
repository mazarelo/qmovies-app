myApp.service('eztv', function( $q , $routeParams ){
  const EZTV = require("eztv");
  
  this.query = function(title , season=1 , episode=1 , imdbId){
    var deferred = $q.defer();
    EZTV.getShows({query: 'big bang'}, function(error, results) {
      deferred.resolve(results);
      console.log(results);
      console.log(error);
      
    });
    return deferred.promise;
  }
    /*
    let eztv = new EZTV();
    var deferred = $q.defer();
    const tvSerie = {
      name:title,
      ep: episode,
      se: season
    }

    eztv.getAllShows().then(res => {
      const data = res;
      console.log("data:");
      console.table(data);
      var result;

      for( var i = 0; i < data.length; i++ ) {
        if( data[i].show.indexOf(tvSerie.name) > -1 ) {
            result = data[i];
            break;
        }
      }

      eztv.getShowData(result).then(res => {
        try{
          res.episodes[tvSerie.se];
          deferred.resolve(res.episodes[tvSerie.se.toString()][tvSerie.ep.toString()]);
        }catch(err){
            console.warn(err);
        }
      });

    }).catch(err => console.error(err));
      return deferred.promise;
    };
    */
});
