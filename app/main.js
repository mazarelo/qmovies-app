/* jslint esversion:6 */
const electron = require('electron');
const fs = require('fs');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
const tempFiles = `${__dirname}/browser/downloads/temp`;
const updater = require('electron-updater');



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;


function createWindow() {
  var startTime = Date.now();
  // Create the browser window.
  win = new BrowserWindow({
    width: 1300,
   height: 724,
   frame:false,
   backgroundColor: '#222',
   show: false,
   darkTheme:true,
   //titleBarStyle: "hidden-inset"
   //type: "textured"
 });

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/browser/index.html`);

  // Open the DevTools.
  win.webContents.openDevTools();

  win.webContents.on('did-finish-load', function() {
    setTimeout(function(){
      win.show();
      console.error(Date.now() - startTime);
    }, 40);
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const {Menu, Tray} = require('electron');
const platform = require('os').platform();

let appIcon = null;
app.on('ready', () => {

  updater.on('ready', function() {  
    createWindow();

    var trayImage;
    var imageFolder = __dirname +'/browser/assets/img/logo.png';

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

  });

  updater.on('update-required', function() {  
      app.quit();
  });

  updater.on('update-available', function() {  

  });
  
  updater.start();
    
});



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  /* on close remove all temporary files on disk */
  function rmDir(tempFiles){
    try {
       var files = fs.readdirSync(tempFiles);
     }catch(e) {
        return;
    }
   if (files.length > 0)
     for (var i = 0; i < files.length; i++) {
       var filePath = `${tempFiles}/${files[i]}`;
       console.log(`File Path = ${filePath}`);
       if (fs.statSync(filePath).isFile()){
         fs.unlinkSync(filePath);
       }else{
         rmDir(filePath);
       }
     }
   fs.rmdirSync(tempFiles);
  }
  rmDir(tempFiles);
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
