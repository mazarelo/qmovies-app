myApp.service('userSettings', function(nightmare, $q){
  const self = this;
  const settings = require('electron-settings');
  /* settings.getSettingsFilePath(); */

  self.getUserName = function(){
    return settings.get('name.first').then(val => {
      console.log(val);
    });
  }

  self.cacheStatus = function(){
    return settings.get('user.cache')
  }

  self.maxQualityStatus = function(){
    return settings.get('user.maxQuality')
  }

  self.clearDownloadsOnExitStatus = function(){
    return settings.get('user.deleteDownloadsOnExit')
  }

  self.get = function(name){
    return settings.get(name);
  }

  self.set = function(name,data){
    return settings.set(name,data);
  }

  self.create = function(name ,obj){
    settings.set('name', {
      first: 'Cosmo',
      last: 'Kramer'
    }).then(() => {
      settings.get('name.first').then(val => {
        console.log(val);
        // => "Cosmo"
      });
    });

  }
});
