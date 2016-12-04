/* API END POINTS
"https://api-fetch.website/tv/shows/1"
"https://api-fetch.website/tv/show/:id"
*/
myApp.service('tvTorrents', function($http){
  const self = this;

  self.getTorrentsByImdbId = function(id){
      console.log(id);
      return $http.get(`https://api-fetch.website/tv/show/${id}`);
  }

});
