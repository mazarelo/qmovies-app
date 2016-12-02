myApp.filter('formatBytes', function(){
  return function( bytes , decimals ){
    if(bytes == 0) return '0 Byte';
    var k = 1000;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
});

myApp.filter('getDomain', function() {
  return function(url){
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    if(url.indexOf("www.") > -1){
      domain = domain.split('www.')[1];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    domain = domain.split('.')[0];
    return domain;
  }
});
myApp.filter('checkResolution', function(){
  return function( name , bytes ){
    if(name.includes("720")){
      return "720p";
    }else if(name.includes("1080")){
      return "1080p";
    }else if(name.includes("4k")){
      return "4k";
    }else{
      return $filter('formatBytes')(bytes);
    }
  }
});

myApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

myApp.filter('round', function() {
  return function(input){
    let number = parseInt(input);
    return Math.round(number);
  }
});

myApp.filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});

myApp.filter('getDomainFromUrl', function() {
  return function(url){
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    if(url.indexOf("www.") > -1){
      domain = domain.split('www.')[1];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    domain = domain.split('.')[0];
    return domain;
  }
});
