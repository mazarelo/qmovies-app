myApp.service('providers', function(streamin , $filter , $q){
  const self = this;

  self.filterProviders = function(provider){
    var deferred = $q.defer();
    let providerFiltered = $filter('getDomain')(provider);
    console.log("Providers:",providerFiltered);

    switch(providerFiltered){
      case "streamin":
        console.log("inside streamin");        
         deferred.resolve( streamin.getFileUrl(provider) );
      break;
      case "vidto":
        deferred.resolve( streamin.getFileUrl(provider) );
      break;
      case "vidtodo":
        deferred.resolve( streamin.getFileUrl(provider) );
      break;
    }
    return deferred.promise;
  }

});
