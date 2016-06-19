myApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-50 && scope.tvFeed.requestRunning == false) { //at the bottom
                    scope.tvFeed.requestRunning = true;
                    scope.tvFeed.page = scope.tvFeed.page +1;
                    scope.tvFeed.loadMore();
                    console.log(scope.tvFeed.page);
                }
            })
        }
    }
  });
