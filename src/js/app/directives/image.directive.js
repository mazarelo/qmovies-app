myApp.directive('preLoadImage', function(){
  return {
        restrict: 'A',
        link: function spinnerLoadLink(scope, elem, attrs) {
            scope.$watch('ngSrc', function watchNgSrc() {
                elem.hide();
                elem.after('<h1>LOADING IMAGE</h1>');  // add spinner
            });
            elem.on('load', function onLoad() {
                elem.show();
                elem.next('h1').remove(); // remove spinner
            });
        }
    };

});