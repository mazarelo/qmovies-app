myApp.service('window', function() {
  const remote = require('electron').remote;
  const {BrowserWindow} = require('electron').remote
  this.open = function( platform , url ){
    var popup = new BrowserWindow({
                  width: 1280,
                 height: 724,
                 frame:false,
                  show: false
                 //type: "textured"
               });
    // and load the index.html of the app.
    popup.loadURL(`file://${__dirname}/index.html#/${platform}/${url}`);
    // Open the DevTools.
    popup.webContents.openDevTools();
    popup.webContents.on('did-finish-load', function() {
      setTimeout(function(){
        popup.show();
      }, 40);
    })
    var trayImage;
    var imageFolder = __dirname + '/app/browser/assets/img/global/iMac-icon.png';

    // Determine appropriate icon for platform
    if (platform == 'darwin') {
        trayImage = imageFolder ;
    }
    else if (platform == 'win32') {
        trayImage = imageFolder;
    }
    appIcon = new Tray(trayImage);

    if (platform == "darwin") {
      appIcon.setPressedImage(imageFolder);
    }

    //window.open(`#/${platform}/${url}`, `${platform}` ,"resizable,scrollbars,status,width=1280,height=720");
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
