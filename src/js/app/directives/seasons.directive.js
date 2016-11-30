myApp.directive('seasonsLayout', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
      <ul class="seasons-wrapper" ng-init="obj.getSeasonInfo(1)">
        <li ng-repeat="item in obj.getNumber(obj.info.number_of_seasons) track by $index" class="sw-item" ng-class="obj.currentSeason == ($index + 1) ? 'selected' : ''" ng-click="obj.getSeasonInfo($index + 1)">
          SEASON {{$index + 1}}
        </li>
      </ul>`
  };
});
