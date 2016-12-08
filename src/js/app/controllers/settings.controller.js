/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc , userSettings , notifications ) {
  const self = this;
  self.title = "Settings";
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

  self.changeLocalPath = function(){
    /*fileSystem.moveFiles(function(){
    });*/
    self.downloadPath = ipc.openFoldersDialog()[0];
    userSettings.set('user.downloadFolder', self.downloadPath );
  }

  self.updateCache = function(){
    var cacheCondition = document.getElementById("cached").checked;
    userSettings.get('user.cache').then(val => {
      if(cacheCondition){
        userSettings.set('user.cache', true );
      }else{
        userSettings.set('user.cache', false );
      }
    })
  }

  self.updateMaxQuality = function(){
    var cacheCondition = document.getElementById("maxQuality").checked;
    userSettings.get('user.maxQuality').then(val => {
      if(cacheCondition){
        userSettings.set('user.maxQuality', true );
        userSettings.get('user').then(val =>{
          console.log("Video Quality max:", val.maxQuality);
        })
      }else{
        userSettings.set('user.maxQuality', false );
        userSettings.get('user.maxQuality').then(val =>{
          console.log("Video Quality max:", val);
        })
      }
    })
  }

});
