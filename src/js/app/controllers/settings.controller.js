/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc , userSettings , notifications ) {
  const self = this;
  self.title = "Settings";
  self.requestRunning  = false;
  userSettings.get('user.downloadFolder').then(val =>{
    self.downloadPath = (val)? val : process.env.DOWNLOAD_PATH;
  })

  self.closeModal = function(){
    document.getElementById("modal-12").classList.remove("md-show");
  }

  userSettings.cacheStatus().then(response =>{
    if(response){
      document.getElementById("cached").checked = true;
    }else{
      document.getElementById("cached").checked = false;
    }
  })

  userSettings.maxQualityStatus().then(response =>{
    if(response){
      document.getElementById("maxQuality").checked = true;
    }else{
      document.getElementById("maxQuality").checked = false;
    }
  })

  userSettings.clearDownloadsOnExitStatus().then(response =>{
    if(response){
      document.getElementById("clearDownloads").checked = true;
    }else{
      document.getElementById("clearDownloads").checked = false;
    }
  })

  self.updateClearDownloads = function(){
    userSettings.get('user.deleteDownloadsOnExit').then(val => {
      if(val){
        userSettings.set('user.deleteDownloadsOnExit', false );
      }else{
        userSettings.set('user.deleteDownloadsOnExit', true );
      }
    });
  }

  self.changeLocalPath = function(){
    /*fileSystem.moveFiles(function(){
    });*/

    self.downloadPath = ipc.openFoldersDialog()[0];
    userSettings.set('user.downloadFolder', self.downloadPath );
    fileSystem.moveFiles( "", self.downloadPath, function(){

    });
  }

  self.updateCache = function(){
    userSettings.get('user.cache').then(val => {
      if(val){
        userSettings.set('user.cache', false );
      }else{
        userSettings.set('user.cache', true );
      }
    });
  }

  self.updateMaxQuality = function(){
    userSettings.get('user.maxQuality').then(val => {
      if(val){
        userSettings.set('user.maxQuality', false )
      }else{
        userSettings.set('user.maxQuality', true )
      }
    })
  }

});
