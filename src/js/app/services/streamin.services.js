myApp.service('streamin', function(nightmare ){
  const self = this;

  self.getFileUrl = function(url){
    console.log("Streamin", url);
    return nightmare.scrapeLinkFromProvider(url);
  }

});

