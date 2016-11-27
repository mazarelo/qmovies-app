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
nightmare.goto('http://'+city+'.craiglist.org/search/cpg?is_paid=yes&postedToday=1')
.wait(2000)
.evaluate(function(){
  /* links */
  var results = [];
  $('.result-image').each(function(){
    let item= {};
    item['title'] = $(this).text();
    item['link'] = $(this).attr("href");
    results.push(item);
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
