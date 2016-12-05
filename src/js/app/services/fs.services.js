myApp.service('fileSystem', function($q){
  const self = this;
  const fs = require('fs');
  const path = require('path');

  const APP_FILES = process.env.APP_FILES;

  self.newFolder = function(name){
    console.log( APP_FILES+"/"+name );

    fs.mkdir(APP_FILES+"/"+name, function (err) {
      if (err) {
          return console.log('failed to write directory', err);
      }
    });
  };

  self.findAllWithMovieExtension = function(startPath , callback){
    var extensions = [ /\.mkv$/ , /\.mp4$/ ];
    // /\.mkv$/ ,
    //console.log('Starting from dir '+startPath+'/');
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){

            self.findAllWithMovieExtension(filename,callback); //recurse
        }
        else{
          extensions.forEach(function(ext){
            if(ext.test(filename)) {
              callback(filename);
            }
          });
        }
    };
  };


  self.listAll = function(path){
    try{
      var files = fs.readdirSync(APP_FILES+"/"+path);
    }catch(err){
      console.log(err);
    }
    return files;
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

  self.removeFile = function(path){
    var deferred = $q.defer();
    let file = APP_FILES+"/"+path;
    console.log( file );
    fs.unlink(file , function (err , data){
      if (err) {
        deferred.resolve("There is no File!");
      }
      deferred.resolve(JSON.parse(data));
    });
    return deferred.promise;
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

  self.deleteFolderRecursive = function(path) {
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

});
