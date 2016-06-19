
myApp.directive("favoriteIcon", function() {
    return {
        template : `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="600px" height="600px" viewBox="0 0 600 600" enable-background="new 0 0 600 600" xml:space="preserve">
            <circle fill="#CF6F55" cx="300" cy="300" r="243.811"/>
            <polygon fill="#FFFFFF" points="431.888,300 225.875,424.379 225.875,175.62 431.888,300 	"/>
          </svg>
        </button>
        `
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

myApp.directive("filtersFeed", function() {
    return {
        template : `
          <input type="text" id="input-search" class="m-typeahead" placeholder="Search for a movie or series here" ng-model="feed.query" ng-change="feed.moviesData()" />
          <select ng-model="feed.sortBy.value" ng-change="feed.moviesData()">
            <option ng-repeat="option in feed.sortBy.options" value="{{option.value}}">{{option.name}}</option>
          </select>
          <select ng-model="feed.genre.value" ng-change="feed.moviesData()">
            <option ng-repeat="genre in feed.genre.options" value="{{genre.value}}">{{genre.name}}</option>
          </select>
        `
    };
});

myApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading directive');
            element.bind('scroll', function () {
                console.log('in scroll');
                console.log(raw.scrollTop + raw.offsetHeight);
                console.log(raw.scrollHeight);
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
});

"use strict";


myApp.directive("minimizeWindow", function() {
  return {
    replace: "true",
    template: `<button ng-click="menu.minimize()" class="window-cmd-icons"><img src="assets/img/global/minus.svg"></button>`
  }
 });

myApp.directive("maximizeWindow", function() {
  return {
    replace: "true",
    template: `<button ng-click="menu.maximize()" class="window-cmd-icons"><img src="assets/img/global/plus.svg"></button>`,
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
    template: `<button ng-click="menu.close()" class="window-cmd-icons"><img src="assets/img/global/close.svg"></button>`,

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

myApp.directive("searchBar", function() {
      return {
        replace: "true",
        template : `
        <div class="search-box-menu-top">
          <filters-feed></filters-feed>
        </div>
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

