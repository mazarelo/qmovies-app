myApp.service('userSettings', function(nightmare, $q){
  const self = this;
  const settings = require('electron-settings');
  /* settings.getSettingsFilePath(); */

  self.getUserName = function(){
    settings.get('name.first').then(val => {
      console.log(val);
    });
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
