
myApp.service('qmovies', function($http , $routeParams ){
  this.getTvEpisodeLinks = function(title){
    var season = ($routeParams.season <10 ? "0"+$routeParams.season : $routeParams.season );
    var episode = ($routeParams.episode <10 ? "0"+$routeParams.episode : $routeParams.season );
    console.log(`http://qmovies.eu/app/functions/series/getEpisodeLinksScrapper.php?title=${title}&season=${season}&episode=${episode}`);
    return $http.get(`http://qmovies.eu/app/functions/series/getEpisodeLinksScrapper.php?title=${title}&season=${season}&episode=${episode}`);
  };
});
