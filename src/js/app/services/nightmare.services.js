myApp.service('nightmare', function($q){
  const self = this;
  var url = {
    "movie": "https://movies.com",
    "tv": "https://another.com"
  }

  var jquery = require('jquery'),
      Nightmare = require('nightmare'),
      nightmare = Nightmare();

  self.scrapeLinkFromProvider = function(url , scrapeSelector){
     var deferred = $q.defer();

    console.log("Inside Nightmare");
    /* test url = 'http://streamin.to/2io0duwvz10t' */
    nightmare.goto(url)
    .wait(7000)
    .click('#btn_download')
    .wait(5000)
    .evaluate(function(){
      var scriptedData = document.querySelector('div.cont_mdl > script:nth-child(5)').textContent.replace(/\s/g, '');
      var getFile =  scriptedData.substring( scriptedData.lastIndexOf("file:")+6, scriptedData.indexOf("image:")-2 );
      return getFile;
    })
    .end()
    .then(function(response){
      console.log("from Nightmare:", response)
      deferred.resolve( response );
    })

    return deferred.promise
  }

});

