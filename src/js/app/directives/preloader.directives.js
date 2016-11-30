myApp.directive('routeLoadingIndicator', function($rootScope) {
   return {
    restrict:'E',
    template:"<div ng-if='isRouteLoading' class='main-loading'></div>",
    replace:true,
    link:function(scope, elem, attrs){
      scope.isRouteLoading = false;

      $rootScope.$on('$routeChangeStart', function(){
        scope.isRouteLoading = true;
      });

      $rootScope.$on('$routeChangeSuccess', function(){
        scope.isRouteLoading = false;
      });
    }
  };
});
