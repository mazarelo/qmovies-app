myApp.service('cache', function( $localStorage, userSettings){
  const self = this;

  self.save = function(name , data , timeToLive){
    userSettings.cacheStatus().then(response =>{
      var returnData;
      if(name){
        returnData = $localStorage[name];
      }else{
        $localStorage[name] = data;
        $localStorage[name].push({time_to_live: timeToLive});
        returnData = $localStorage[name];
      }
      return returnData;
    });
  }

  self.get = function(name){
    if($localStorage[name]){
      console.log("Cached obj:",$localStorage[name])
      return $localStorage[name];
    }
    return false;
  }

  self.delete = function(name){
    delete $localStorage[name];
  }

  self.alter = function(name , data){
    $localStorage[name] = data;
  }

});
