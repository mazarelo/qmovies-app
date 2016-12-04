
myApp.service('nightmare', function($q){
  const self = this;

  var jquery = require('jquery'),
      Nightmare = require('nightmare');

  self.scrapeLinkFromProvider = function(url = "" , scrapeSelector = ""){
    console.log("Inside Nightmare");
    var nightmare = Nightmare();
    /* test url = 'http://streamin.to/2io0duwvz10t' */
    var url = "http://streamin.to/2io0duwvz10t";

    nightmare.goto(url)
    .wait(7000)
    .click('#btn_download')
    .wait(5000)
    .evaluate(function(){
      console.log("inside evalutate");
      var scriptedData = document.querySelector('div.cont_mdl > script:nth-child(5)').textContent.replace(/\s/g, '');
      var getFile =  scriptedData.substring( scriptedData.lastIndexOf("file:")+6, scriptedData.indexOf("image:")-2 );
      return new Promise((resolve, reject) => {
             setTimeout(() => resolve(getFile), 2000);
        }, selector)
    })
    .end()
    .then((response)=>{
      console.log("NIGHTMARE:",response);
    })
  }
});
