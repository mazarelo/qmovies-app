/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc , userSettings , notifications ) {
  const self = this;
  self.title = "Settings";
  self.downloadPath = process.env.DOWNLOAD_PATH;

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

  self.changeLocalPath = function(){
    self.downloadPath = ipc.openFoldersDialog()[0];
    console.log(self.downloadPath);
  }

  self.updateCache = function(){
    var cacheCondition = document.getElementById("cached").checked;
    userSettings.get('user.cache').then(val => {
      if(cacheCondition){
        userSettings.set('user', { cache: true } );
        notifications.new("Cache is On!", "", "Settings" , "")
      }else{
        userSettings.set('user', { cache: false } );
        notifications.new("Cache is off!", "", "Settings" , "")
      }
    })
  }

  self.updateMaxQuality = function(){
    var cacheCondition = document.getElementById("maxQuality").checked;
    userSettings.get('user.cache').then(val => {
      if(cacheCondition){
        userSettings.set('user', { cache: true } );
      }else{
        userSettings.set('user', { cache: false } );
      }
    })
  }

});
