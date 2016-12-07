/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc ) {
  const self = this;
  self.title = "Settings";
  self.downloadPath = process.env.DOWNLOAD_PATH;

  self.closeModal = function(){
    document.getElementById("modal-12").classList.remove("md-show");
  }
  const settings = require('electron-settings');
  settings.get('user.cache').then(val => {
    console.log("cache",val);
  });

  self.changeLocalPath = function(){
    self.downloadPath = ipc.openFoldersDialog()[0];
    console.log(self.downloadPath);
  }

  self.updateCache = function(){
    let condition = document.getElementById("cached").checked;
    const settings = require('electron-settings');
    settings.get('user.cache').then(val => {
      if(condition){
        settings.set('user', {
          cache: true
        });
      }else{
        settings.set('user', {
          cache: false
        });
      }
    })
  }
});
