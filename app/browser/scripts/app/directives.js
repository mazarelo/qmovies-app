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

myApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-50 && scope.tv.requestRunning == false) {
                    scope.tv.requestRunning = true;
                    scope.tv.page = scope.tv.page +1;
                    scope.tv.loadMore();
                }
            })
        }
    }
  });
