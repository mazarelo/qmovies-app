myApp.directive('feedLayout', function(){
  return {
    restrict: 'E',
    scope: {
      type: '@type',
      obj: '='
    },
    template: `
        <div id="feed"  ng-repeat="item in obj.results | unique:'id'" class="feed-template">
          <a href="#/{{type}}/{{item.id}}">
            <figure class="ft-img">
              <stored-img ng-url="{{obj.tmdbImgUrl.w300}}{{item.poster_path}}" err-src="assets/img/no-image.jpg"/>
            </figure>
            <div class="ft-content">
              <a href="">{{type == 'tv' ? item.name : item.title}} <span class="ft-c-date">{{item.date}}</span></a>
            </div>
          </a>
        </div>`
  };

});
