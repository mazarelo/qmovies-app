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
