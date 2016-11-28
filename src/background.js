// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, Tray , BrowserWindow } from 'electron';
import fs from 'fs';
import { devMenuTemplate } from './menu/dev_menu_template';
import { trayMenuTemplate } from './menu/tray_menu_template';
//import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

const platform = require('os').platform();
/* DEFINE TEMP Folder */
process.env.APP_FILES = app.getPath('userData');
process.env.DOWNLOAD_PATH =  `${app.getPath('userData')}/downloads`;
console.log( app.getPath('userData'));
try {
    // Query the entry
    var stats = fs.lstatSync(process.env.DOWNLOAD_PATH);
    // Is it a directory?
    if (stats.isDirectory()) {
      console.log("Download File exists");
    }else{
      fs.mkdir(process.env.DOWNLOAD_PATH, function(error) {
        console.log(error);
      });
    }
}
catch (e) {
    console.log(e);
}

export var mainWindow;
export var createWindow = function(url) {
  var startTime = Date.now();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 576,
    frame:true,
    backgroundColor: '#222',
    show: false,
    maximizable:true,
    resizable: true,
    darkTheme:true,
    alwaysOnTop:false
    });
  // and load the index.html of the app.
  mainWindow.loadURL(url);

mainWindow.webContents.on('did-finish-load', () => {
  setTimeout(function(){
    mainWindow.show();
    console.error(Date.now() - startTime);
    }, 40);
  });

 mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

var setApplicationMenu = () => {
    //var menus = [editMenuTemplate];
    var menus = [];
    if (env.name !== 'production') {
      menus.push(devMenuTemplate);
      Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
    }
};

var setTrayMenu = () => {
  // Determine appropriate icon for platform
  var imageFolder = __dirname +'/browser/assets/img/logo-tray@2x.png';
  var trayImage;

  if (platform == 'darwin') {
      trayImage = imageFolder ;
  }else if (platform == 'win32') {
      trayImage = imageFolder;
  }

  var trayMenu = new Tray(trayImage);
  var contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  trayMenu.setToolTip('This is my application.')
  trayMenu.setContextMenu(contextMenu)

  if (platform == "darwin") {
    trayMenu.setPressedImage(imageFolder);
  }
}

var rmDir = () =>{

  try {
     var files = fs.readdirSync(process.env.DOWNLOAD_PATH);
  }catch(e) {
      return;
  }

 if (files.length > 0){
   for (var i = 0; i < files.length; i++) {
     var filePath = `${process.env.DOWNLOAD_PATH}/${files[i]}`;
     //console.log(`File Path = ${filePath}`);
     if ( fs.statSync(filePath).isFile() ){
       fs.unlinkSync(filePath);
     }else{
       rmDir(filePath);
     }
   }
 }
 fs.rmdirSync(process.env.DOWNLOAD_PATH);
}

// Save userData in separate folders for each environment.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', () => {
    setApplicationMenu();
    setTrayMenu();
    createWindow('file://' + __dirname + '/browser/index.html');

    if (env.name === 'development') {
      mainWindow.openDevTools();
    }
});

app.on('window-all-closed', () => {
  /* delete Download folder */
    rmDir(process.env.DOWNLOAD_PATH);

    if (platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow('file://' + __dirname + '/browser/index.html');
  }
});
