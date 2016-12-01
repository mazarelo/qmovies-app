myApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log(`${raw.scrollTop + raw.offsetHeight} == ${raw.scrollHeight}`);
/*
            if(raw.scrollTop + raw.offsetHeight == raw.scrollHeight){
              console.log("loaded more");
              scope.tv.requestRunning = true;
              scope.tv.page = scope.tv.page +1;
              scope.tv.loadMore();
            }
*/
            element.bind('scroll', function () {
              if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-100 && scope.tv.requestRunning == false) {
                  scope.tv.requestRunning = true;
                  scope.tv.loadMore();
              }
            })
        }
    }
  });
