
myApp.service('qmovies', function($http , $routeParams ){
  this.getTvTorrents = function(title , season=1 , episode=1){
    season = (season <10 ? "0"+season : season );
    episode = (episode <10 ? "0"+episode : episode );
    console.log(`http://qmovies.eu/app/functions/series/getEpisodeTorrentsScrapper.php?title=${title} S${season}E${episode}`);
    return $http.get(`http://qmovies.eu/app/functions/series/getEpisodeTorrentsScrapper.php?title=${title} S${season}E${episode}`);
  };
});
