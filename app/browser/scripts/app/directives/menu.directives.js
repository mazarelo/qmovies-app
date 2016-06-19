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
