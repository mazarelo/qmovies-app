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