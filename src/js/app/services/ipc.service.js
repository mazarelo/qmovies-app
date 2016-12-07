
myApp.service('ipc', function($http){
  const self = this;
  const {ipcRenderer} = require('electron');

  self.openDialog = function(id, data){
    return ipcRenderer.sendSync(id, data)
  }

  self.openFoldersDialog = function(){
    return ipcRenderer.sendSync("open-folder", "download-path");
  }

});
