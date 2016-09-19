myApp.service('folder', function($q){
  const self = this;
  const fs = require('fs');

  self.new = function(name){
    console.log( __dirname+"/"+name );

    fs.mkdir(__dirname+"/"+name, function (err) {
      if (err) {
          return console.log('failed to write directory', err);
      }
    });
  };

  self.readFolder = function(dir){
    console.log( fs.readdirSync(folder) );
    var folder = __dirname+"/"+dir;
  };

  self.fileExists = function(path){
    try{
      fs.stat(__dirname+"/"+path+".json", function(err, stats){
        console.log(stats);
      });
    }catch(e){
      console.log(e);
    }
  };

  self.removeFolder = function(dir){
    let folder = __dirname+"/"+dir;
    console.log( folder );
    fs.unlink(folder);
  };

  self.readJson = function(file){
    var deferred = $q.defer();
    fs.readFile( __dirname+"/"+file+".json", 'utf8', function (err, data) {
      if (err) {
        deferred.resolve("There is no File!");
      }

      deferred.resolve(JSON.parse(data));
    });
    return deferred.promise;
  };

  self.createJsonFile = function(name , data){
    fs.writeFile(__dirname+"/"+name+".json", data , function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      });
  };

  self.checkLastModified = function(name){

  }

});
