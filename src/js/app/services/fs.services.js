myApp.service('folder', function($q){
  const self = this;
  const fs = require('fs');
  const APP_FILES = process.env.APP_FILES+"\\jsonCache";

  self.new = function(name){
    console.log( APP_FILES+"/"+name );

    fs.mkdir(APP_FILES+"/"+name, function (err) {
      if (err) {
          return console.log('failed to write directory', err);
      }
    });
  };

  self.listAll = function(){
    console.log( fs.readdirSync(APP_FILES) );
    var folder = APP_FILES;
  };

  self.fileExists = function(path){
    try{
      fs.stat(APP_FILES+"/"+path+".json", function(err, stats){
        console.log(stats);
      });
    }catch(e){
      console.log(e);
    }
  };

  self.removeFolder = function(dir){
    let folder = APP_FILES+"/"+dir;
    console.log( folder );
    fs.unlink(folder);
  };

  self.readJson = function(file){
    var deferred = $q.defer();
    fs.readFile( APP_FILES+"/"+file+".json", 'utf8', function (err, data) {
      if (err) {
        deferred.resolve("There is no File!");
      }

      deferred.resolve(JSON.parse(data));
    });
    return deferred.promise;
  };

  self.createJsonFile = function(name , data){
    fs.writeFile(APP_FILES+"/"+name+".json", data , function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      });
  };

  self.checkLastModified = function(name){

  }

});
