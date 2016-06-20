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
