myApp.service('folder', function(){
  const self = this;

  const fs = require('fs');

  self.new = function(name){
    console.log( __dirname+"/"+name );
    fs.mkdir(__dirname+"/"+name);
  };

  self.readFolder = function(dir){
    console.log( fs.readdirSync(folder) );
    var folder = __dirname+"/"+dir;
  };

  self.removeFolder = function(dir){
    let folder = __dirname+"/"+dir;
    console.log( folder );
    fs.unlink(folder);
  };

  self.createJsonFile = function(name , data){

  }

  self.checkLastModified = function(name){
    
  }

});
