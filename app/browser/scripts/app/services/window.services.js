myApp.service('window', function() {
  const remote = require('electron').remote;

  this.open = function( platform,url ){
    console.log(`#/${platform}/${url}`);
    window.open(`#/${platform}/${url}`, `${platform}` ,"resizable,scrollbars,status,width=1280,height=720");
  }

   this.minimize = function() {
     const window = remote.getCurrentWindow();
     window.minimize();
   }

   this.maximize = function() {
     const window = remote.getCurrentWindow();
     if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
   }
   
   this.close = function() {
     const window = remote.getCurrentWindow();
     window.close();
   };
});
