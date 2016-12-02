myApp.service('cache', function( $localStorage){

  this.save = function(name , data , timeToLive){
    var returnData;
    if(name){
      returnData = $localStorage[name];
    }else{
      $localStorage[name] = data;
      $localStorage[name].push({time_to_live: timeToLive});
      returnData = $localStorage[name];
    }
    return returnData;
  }

  this.get = function(name){
    if($localStorage[name]){
      console.log("Cached obj:",$localStorage[name])
      return $localStorage[name];
    }
    return false;
  }

  this.delete = function(name){
    delete $localStorage[name];
  }

  this.alter = function(name , data){
    $localStorage[name] = data;
  }

});
