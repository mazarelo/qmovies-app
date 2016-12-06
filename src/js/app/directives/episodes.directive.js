myApp.directive('episodesLayout', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
      <ul class="episodes-wrapper">
        <li ng-repeat="episode in obj.episodes track by $index"
        class="ew-item"
        ng-class="obj.currentEpisode == ($index + 1) ? 'selected' : ''">
          <div ng-controller="DownloadEpisodeController as download" ng-click="download.episode(obj.currentSeason , $index+1 , obj.torrents )" class="ew-i-name">
            {{$index+1}} - {{episode.name}}
            <span id="speed-{{obj.tmdbId}}-{{obj.currentSeason }}-{{$index+1}}" class="download-speed"></span>
          </div>
          <div ng-controller="DownloadEpisodeController as download" ng-init="download.checkLocaly(obj.currentSeason , $index+1)"  class="download-btn">
            <img ng-if="!download.isSaved" src="assets/img/download.svg" ng-click="download.episode( obj.currentSeason , $index+1 , obj.torrents)" />
            <img ng-if="download.isSaved" src="assets/img/delete.svg" ng-click="download.delete( obj.currentSeason , $index+1)"/>
          </div>
          <div class="progress-bar"><progress id="{{obj.tmdbId}}-{{obj.currentSeason }}-{{$index+1}}" value="0" max="1"></progress></div>
        </li>

      </ul>`
  };
});
