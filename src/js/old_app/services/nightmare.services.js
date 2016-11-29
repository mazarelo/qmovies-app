'use strict';
/*
myApp.service('nightmare', function($http , $routeParams ){
  const self = this;
  var url = {
    "movie": "https://movies.com",
    "tv": "https://another.com"
  }
var Nightmare = require('nightmare'),
    nightmare = Nightmare();

    self.getTvSeriesLinks = function(){
      var deferred = $q.defer();
*/
var jquery = require('jquery'),
    Nightmare = require('nightmare'),
    nightmare = Nightmare();

var url = "https://craig.co.uk";

var city = process.argv[2];
nightmare.goto('http://watchepisodes.cc/american_horror_story_s1s11/')
.wait()
.evaluate(function(){
  /* links */
  var results = [];
  var elements = document.querySelectorAll(".table-info-links .btn-bordered");

  elements.forEach(function(item) {
    var single = {};
    single['title'] = item.textContent;
    single['link'] = item.href;
    results.push(single);
  });

  return results;
})
.end()
.then(function(result){
  console.log(result);
  for(var single in result){
    console.log(result[single].title);
    console.log(result[single].link);
    console.log("\n");
  }

  //deferred.resolve(result);
});
      /*
      return deferred.promise;
    }

    self.getMoviesLinks = function(){

    }

});
*/
