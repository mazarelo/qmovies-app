
myApp.directive("favoriteIcon", function() {
    return {
        template : `
        <svg version="1.1" id="favorite-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="510px" height="510px" viewBox="0 0 510 510" enable-background="new 0 0 510 510" xml:space="preserve">
                      <path id="heart-fill"  d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4
                        c43.35,0,86.7,20.4,114.75,53.55C283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65
                        c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></svg>
        `
    };
});

myApp.directive("playButton", function() {
    return {
        template : `
        <button class="le-action">
          <svg version="1.1" id="play-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="600px" height="600px" viewBox="0 0 600 600" enable-background="new 0 0 600 600" xml:space="preserve">
            <circle fill="#CF6F55" cx="300" cy="300" r="243.811"/>
            <polygon fill="#FFFFFF" points="431.888,300 225.875,424.379 225.875,175.62 431.888,300 	"/>
          </svg>
        </button>
        `
    };
});

myApp.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
});

myApp.directive("infinitLoader", function() {
    return {
        template : `
        <div id="checkView" scroll class="load-more-wrapper">
          <figure id="load-more">
            <img src="assets/img/loading.svg">
          </figure>
        </div>
        `
    };
});
myApp.directive("filtersTvFeed", function() {
    return {
        template : `
          <input type="text" id="input-search" class="m-typeahead" placeholder="Search for a movie or series here" ng-model="tvFeed.query" ng-change="tvFeed.search()" />
          <select ng-model="tvFeed.sortBy.value" ng-change="tvFeed.discover()">
            <option ng-repeat="sort in tvFeed.sortBy.options" value="{{sort.value}}">{{sort.name}}</option>
          </select>
          <select ng-model="tvFeed.genre.value" ng-change="tvFeed.discover()">
            <option value="" ng-selected="selected">any genre</option>
            <option ng-repeat="genre in tvFeed.genre.options" value="{{genre.value}}">{{genre.name}}</option>
          </select>
          <select ng-model="tvFeed.years.value" ng-change="tvFeed.discover()">
            <option value="" ng-selected="selected">all years</option>
            <option ng-repeat="year in tvFeed.years.options() | reverse" value="{{year}}">{{year}}</option>
          </select>
          <input type="number" hidden ng-model="tvFeed.page" ng-change="tvFeed.discover()">
        `
    };
});
myApp.directive("filtersMovieFeed", function() {
    return {
        template : `
          <input type="text" id="input-search" class="m-typeahead" placeholder="Search for a movie or series here" ng-model="movieFeed.query" ng-change="movieFeed.moviesData()" />
          <select ng-model="movieFeed.sortBy.value" ng-change="movieFeed.moviesData()">
            <option ng-repeat="option in movieFeed.sortBy.options" value="{{option.value}}">{{option.name}}</option>
          </select>
          <select ng-model="movieFeed.genre.value" ng-change="movieFeed.moviesData()">
            <option ng-repeat="genre in movieFeed.genre.options" value="{{genre.value}}">{{genre.name}}</option>
          </select>
        `
    };
});

"use strict";

myApp.directive("minimizeWindow", function() {
  return {
    replace: "true",
    template: `
    <button ng-click="menu.minimize()" class="window-cmd-icons">
      <svg version="1.1"  id="window-ctr-minimize" xmlns="http://www.w3.org/2000/svg" class="" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <circle style="fill:#ED8A19;" cx="25" cy="25" r="25"/>
        <line class="hover" style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="38" y1="25" x2="12" y2="25"/>
      </svg>
    </button>`
  }
 });

myApp.directive("maximizeWindow", function() {
  return {
    replace: "true",
    template: `
    <button ng-click="menu.maximize()" class="window-cmd-icons">
      <svg version="1.1" id="window-ctr-maximize" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <circle style="fill:#43B05C;" cx="25" cy="25" r="25"/>
        <line class="hover" style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="25" y1="13" x2="25" y2="38"/>
        <line class="hover" style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" x1="37.5" y1="25" x2="12.5" y2="25"/>
      </svg>
    </button>`,
    link: function(scope, element, attrs) {
       element.on('click', function() {
           window.maximize();
       });
     }
  }
 });

 myApp.directive("windowControlles", function() {
     return {
         template : `
           <close-window></close-window>
           <minimize-window></minimize-window>
           <maximize-window></maximize-window>
         `
     }
 });

myApp.directive("closeWindow", function() {
  return {
    replace: "true",
    template: `
    <button ng-click="menu.close()" class="window-cmd-icons">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <circle style="fill:#D75A4A;" cx="25" cy="25" r="25"/>
        <polyline class="hover" style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;stroke-miterlimit:10;" points="16,34 25,25 34,16 "/>
        <polyline class="hover" style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;stroke-miterlimit:10;" points="16,16 25,25 34,34"/>
      </svg>
    </button>`,

  }
 });
 myApp.directive("forwardBtn", function() {
   return {
     replace: "true",
     template: `<button class="previous-forward-controlls"><img src="assets/img/global/right-arrow.svg"></button>`,
     link: function(scope, element, attrs) {
        element.on('click', function() {
            history.forward();
        });
      },
   }
  });

myApp.directive("backBtn", function() {
  return {
    replace: "true",
    template: `<button class="previous-forward-controlls"><img src="assets/img/global/left-arrow.svg"></button>`,
    link: function(scope, element, attrs) {
       element.on('click', function() {
           history.back();
       });
     }
  }
 });

myApp.directive("loginBtn", function() {
      return {
        replace: "true",
        template : `
        <a id="login-btn" href="#">
           <figure  class="tp-login-option">
              <img src="assets/img/global/arrow-down.svg">
          </figure>
          <h4 id="user-login-name" data-user-id=""></h4>
          <figure class="tp-user-avatar">
              <img src="assets/img/avatar/user.png" alt="user">
          </figure>
        </a>
      `
      }
});

myApp.directive("logoIcon", function() {
      return {
        replace: "true",
        template : `
        <a href="/">
            <figure>
                <img src="assets/img/qmovie-logo-white.png" alt="logo" name="query">
            </figure>
        </a>
        `
      }
});

myApp.directive("loginPanel", function() {
      return {
        replace: "true",
        template : `
        <div class="login-drop-down-panel">
            <ul>
                <!--<li><figure></figure>Dashboard</li> -->
                <a href="favorites"><li><figure><img src="assets/img/global/favorite.svg"/></figure>Favorite <span>( TV Series )</span></li></a>
                <a href="watchlist"><li><figure><img src="assets/img/dark-template/icons/svg/icon_1.svg"/></figure>Watch list <span>( Movies )</span></li></a>
                <a href="?logout"><li><figure></figure><button>Sign Out</button></li></a>
            </ul>
        </div>
        `
      }
});

myApp.directive('routeLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<div ng-show='isRouteLoading' class='loading-indicator'>loading</div>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;

      $rootScope.$on('$routeChangeStart', function() {
        scope.isRouteLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function() {
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
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight-50 && scope.tvFeed.requestRunning == false) { //at the bottom
                    scope.tvFeed.requestRunning = true;
                    scope.tvFeed.page = scope.tvFeed.page +1;
                    scope.tvFeed.loadMore();
                }
            })
        }
    }
  });

myApp.directive("videoControllers", function() {
  return {
    replace: "true",
    template: `
    <div id="player" ng-controller="VideoController as video">
      <div id="video-controls">
        <figure ng-click="video.play()">
          <img src="assets/img/global/play-button.svg">
        </figure>
        <figure ng-click="video.pause()">
          <img src="assets/img/global/pause-button.svg">
        </figure>
        <figure ng-click="video.stop()">
          <img src="assets/img/global/stop-button.svg">
        </figure>
        <figure ng-click="video.fullScreen()">
          <img src="assets/img/global/fullscreen-button.svg">
        </figure>
      </div>
      <div id="video-placeholder">
      </div>
    </div>`
  }
 });
