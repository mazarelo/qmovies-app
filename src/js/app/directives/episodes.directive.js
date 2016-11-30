myApp.directive('episodesLayout', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
      <ul class="episodes-wrapper">
        <li ng-repeat="episode in obj.episodes track by $index" class="ew-item"  ng-class="obj.currentEpisode == ($index + 1) ? 'selected' : ''">
          {{$index+1}} - {{episode.name}}
        </li>
      </ul>`
  };
});
