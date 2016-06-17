
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
      var folder = __dirname+"/"+dir;
      fs.unlink(folder);
     };
});


myApp.service('webTorrent', function(folder) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();

  this.request = function(magnet){
     client.add( magnet , {path: __dirname+"/downloads"} , function(torrent) {
        torrent.files[1].appendTo('body');
        let torrentName = torrent.name;
        return torrentName;
      });
    };

  this.play = function(magnet){
      var magnetURI = magnet;
      return this.request(magnet);
   };
});
