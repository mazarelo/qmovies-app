myApp.directive('offlineErr', function(){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      title: '@title',
      obj:'=',
      exec: '&'
    },
    template: `
      <div class="no-results">
          <div class="nr-center">
            <figure class="nr-img">
              <img src="assets/img/internet.svg">
            </figure>
            <h3 class="nr-err-title">{{title}}<br><a ng-click="exec()" class="refresh">Retry</a></h3>
          </div>
      </div>`
  };
});
