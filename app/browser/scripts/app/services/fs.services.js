myApp.service('folder', function(){
    const fs = require('fs');

     this.new = function(name){
      console.log(__dirname+"/"+name);
      fs.mkdir(__dirname+"/"+name);
     };

     this.readFolder = function(dir){
        var folder = __dirname+"/"+dir;
        console.log(fs.readdirSync(folder ));
     };

     this.removeFolder = function(dir){
      let folder = __dirname+"/"+dir;
      console.log(folder);
      fs.unlink(folder);
     };
});
