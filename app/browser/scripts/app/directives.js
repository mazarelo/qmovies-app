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

myApp.directive('episodesLayout', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
      <ul class="episodes-wrapper">
        <li ng-repeat="episode in obj.episodes track by $index"
        class="ew-item"
        ng-class="obj.currentEpisode == ($index + 1) ? 'selected' : ''">
          <div ng-controller="DownloadEpisodeController as download" ng-click="download.episode(obj.currentSeason , $index+1 , obj.torrents )" class="ew-i-name">
            {{$index+1}} - {{episode.name}}
            <span id="speed-{{obj.tmdbId}}-{{obj.currentSeason }}-{{$index+1}}" class="download-speed"></span>
          </div>
          <div ng-controller="DownloadEpisodeController as download"  class="download-btn">
            <img ng-if="!download.isSaved" src="assets/img/download.svg" ng-click="download.episode( obj.currentSeason , $index+1 , obj.torrents)" />
            <img ng-if="download.isSaved" src="assets/img/delete.svg" ng-click="download.delete( obj.currentSeason , $index+1)"/>
          </div>
          <div class="progress-bar"><progress id="{{obj.tmdbId}}-{{obj.currentSeason }}-{{$index+1}}" value="0" max="1"></progress></div>
        </li>

      </ul>`
  };
});

/* Needs fix -  passing functions to directives */
myApp.directive('offlineErr', function(){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      title: '@title',
      obj:'='
    },
    template: `
      <div class="no-results">
          <div class="nr-center">
            <figure class="nr-img">
              <img src="assets/img/internet.svg">
            </figure>
            <h3 class="nr-err-title">{{title}}<br><a ng-click="obj.getFeed( obj.typesOfSearch.active )" class="refresh">Retry</a></h3>
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
        <div  ng-repeat="item in obj.results | unique:'id'" class="feed-template">
          <a href="#/{{type}}/{{item.id}}">
            <figure class="ft-img">
              <stored-img ng-url="{{obj.tmdbImgUrl}}w300{{item.poster_path}}"/>
            </figure>
            <div class="ft-content">
              <a href="">{{type == 'tv' ? item.name : item.title}} <span class="ft-c-date">{{item.date}}</span></a>
            </div>
          </a>
        </div>`
  };

});

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

myApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            //console.log(`${raw.scrollTop + raw.offsetHeight} == ${raw.scrollHeight}`);
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

myApp.directive('seasonsLayout', function(){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    template: `
      <ul class="seasons-wrapper" ng-init="obj.getSeasonInfo(1)">
        <li ng-repeat="item in obj.getNumber(obj.info.number_of_seasons) track by $index" class="sw-item" ng-class="obj.currentSeason == ($index + 1) ? 'selected' : ''" ng-click="obj.getSeasonInfo($index + 1)">
          SEASON {{$index + 1}}
        </li>
      </ul>`
  };
});
