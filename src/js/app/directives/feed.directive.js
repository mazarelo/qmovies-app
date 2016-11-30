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
