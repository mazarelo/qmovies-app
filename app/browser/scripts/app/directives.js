myApp.directive('offlineErr', function(){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      title: '@title',
      exec: '&'
    },
    template: `
      <div class="no-results">
          <div class="nr-center">
            <figure class="nr-img">
              <img src="assets/img/internet.svg">
            </figure>
            <h3 class="nr-err-title">{{title}}<br><a ng-click="exec({msg:'dope'})" class="refresh">Retry</a></h3>
          </div>
      </div>`
  };
});

myApp.directive('feedLayout', function(){
  return {
    restrict: 'E',
    scope: {
      type: '@type',
      obj: '='
    },
    template: `
        <div  ng-repeat="item in obj.results" class="feed-template">
          <a href="#/{{type}}/{{item.id}}">
            <figure class="ft-img">
              <img src="{{obj.tmdbImgUrl}}w300{{item.poster_path}}">
            </figure>
            <div class="ft-content">
              <a href="">{{type == 'tv' ? item.name : item.title}} <span class="ft-c-date">{{item.date}}</span></a>
            </div>
          </a>
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
