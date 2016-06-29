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
    //window.open(`#/${platform}/${url}`, `${platform}` ,"resizable,scrollbars,status,width=1280,height=720");
  }

  this.scrollToTop = function(scrollDuration) {
    let feedEl = document.getElementById("feed-ajax");
    currentScrollTop = feedEl.scrollTop;
    let scrollStep = feedEl.scrollTop / (scrollDuration / 15);
      
    let scrollInterval = setInterval(function(){
        if (feedEl.scrollTop != 0 ) {
          console.log(feedEl.scrollTop);
            feedEl.scrollTop = feedEl.scrollTop - scrollStep;
        }
        else clearInterval(scrollInterval); 
    },15);
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
