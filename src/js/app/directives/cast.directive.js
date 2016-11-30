myApp.directive('castLayout', function(){
  return {
    restrict: 'E',
    scope: {
      type: '@type',
      obj: '=obj'
    },
     template: `
      <div class="cast-template" ng-repeat="element in (type=='cast'? obj.info.cast : obj.info.crew)">
        <figure class="ct-avatar">
          <img src="{{obj.tmdbImgUrl}}w150{{element.profile_path}}">
        </figure>
        <div class="ct-content">
          <h5>{{element.character}}</h5>
          <h4>{{element.name}}</h4>
        </div>
      </div>`
  };
});
