myApp.directive('offlineErr', function(){
  return {
    restrict: 'E',
    scope: {
      title: '@'
    },
    template: `
      <div class="no-results" ng-if="!online">
          <div class="nr-center">
            <figure class="nr-img">
              <img src="assets/img/internet.svg">
            </figure>
            <h3 class="nr-err-title">{{title}}<br><a ng-click="tv.getCrew()" class="refresh">Retry</a></h3>
          </div>
      </div>`
  };
});
