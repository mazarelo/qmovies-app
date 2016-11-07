/* jslint esversion:6 */
const electron = require('electron');
const fs = require('fs');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
const tempFiles = `${__dirname}/browser/downloads/temp`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;

function createWindow(url) {
  var startTime = Date.now();
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
   height: 800,
   frame:true,
   backgroundColor: '#222',
   show: false,
   maximizable:true,
   resizable: true,
   darkTheme:true
   //titleBarStyle: "hidden-inset"
   //type: "textured"
 });

  // and load the index.html of the app.
  win.loadURL(url);

  /* Open the DevTools.
  win.webContents.openDevTools();
  */
 
  /* OSX FULL SCREEN */
  win.webContents.on('did-finish-load', () => {
    setTimeout(function(){
      win.show();
      console.error(Date.now() - startTime);
    }, 40);
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

/* on close remove all temporary files on disk */
function rmDir(tempFiles){
  try {
     var files = fs.readdirSync(tempFiles);
   }catch(e) {
      return console.log(e);
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

const {Menu, Tray} = require('electron');
const platform = require('os').platform();
let appIcon = null;

app.on('ready', () => {
  createWindow(`file://${__dirname}/browser/index.html`);

  var trayImage;
  var imageFolder = __dirname +'/browser/assets/img/logo-tray@2x.png';

  // Determine appropriate icon for platform
  if (platform == 'darwin') {
      trayImage = imageFolder ;
  }
  else if (platform == 'win32') {
      trayImage = imageFolder;
  }

  trayMenu = new Tray(trayImage);

  var contextMenu = Menu.buildFromTemplate([
    {label: 'Open Qmovies',click(){
      win.show()
    }},
    {
      type:'separator'
    },
    {label: 'Movies', click(){
      win.loadURL(`file://${__dirname}/browser/index.html#/movies`);
    }},
    {label: 'Tv Series', click(){
      win.loadURL(`file://${__dirname}/browser/index.html#/tv`);
    }},
    {
      type:'separator'
    },
    {label: 'Quit', click(){
        rmDir(tempFiles);
        app.quit();
    }}
  ]);

  trayMenu.setToolTip('This is my application.')
  trayMenu.setContextMenu(contextMenu)

  if (platform == "darwin") {
    trayMenu.setPressedImage(imageFolder);
  }

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {

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
