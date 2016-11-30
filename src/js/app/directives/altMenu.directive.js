myApp.directive('altMenu', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
        <h1 class="title">{{obj.title}}</h1>
        <ul class="alt_nav">
          <li ng-repeat="item in obj.typesOfSearch.options" value="item.value" ng-class="item.value == obj.typesOfSearch.active ? 'selected' : ''" ng-click="obj.getFeed(item.value)">{{item.name}}</li>
        </ul>
        <div class="top-to-bottom-degrade"></div>`
  };

});


