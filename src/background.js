// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, Tray , BrowserWindow } from 'electron';
import fs from 'fs';
import { devMenuTemplate } from './menu/dev_menu_template';
import { trayMenuTemplate } from './menu/tray_menu_template';
import {ipcMain} from 'electron';
//import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
const {dialog} = require('electron');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';
const platform = require('os').platform();
/* DEFINE TEMP Folder */
process.env.downloadBestQuality = env.downloadBestQuality;
process.env.APP_FILES = app.getPath('userData');
process.env.DOWNLOAD_PATH =  ( env.customDownloadFolder ? end.customDownloadFolder : `${app.getPath('userData')}/downloads` );

try {
  fs.access(process.env.DOWNLOAD_PATH, fs.F_OK, function(err) {
      if (!err) {
        console.log("Download File exists");
      } else {
        fs.mkdir( process.env.DOWNLOAD_PATH , function(error, status) {
          console.log("Folder Created", process.env.DOWNLOAD_PATH );
        });
      }
  });
}
catch (e) {
  console.log(e);
}

console.log( process.env.DOWNLOAD_PATH );

export var mainWindow;
export var createWindow = function(url) {
  var startTime = Date.now();
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 640,
    frame:true,
    backgroundColor: '#f1f1f1',
    show: false,
    maximizable:true,
    resizable: true,
    darkTheme:true,
    alwaysOnTop:false,
    'minWidth': 1024,
    'minHeight': 640
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

    /* Renderer interactions with Main */
    ipcMain.on('open-folder', (event, arg) =>{
      let newPath = dialog.showOpenDialog({properties: ['openDirectory']});
      newPath = (newPath == undefined) ? [process.env.DOWNLOAD_PATH] : newPath;
      event.returnValue = newPath;
    });

});

app.on('window-all-closed', () => {

  if(env.deleteDownloadsOnExit){
    deleteFolderRecursive( process.env.DOWNLOAD_PATH ,function(err,status){
      console.log(status);
      console.log(err);
    });
  }

  if(!env.cache){
    /* delete * from localStorage api */
  }

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

var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
