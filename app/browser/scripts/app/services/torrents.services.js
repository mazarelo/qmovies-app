myApp.service('webTorrent', function(folder , callback) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();

  this.request = function(magnet){
     client.add( magnet , {path: __dirname+"/downloads"} , function(torrent) {
        torrent.files[1].appendTo('body');
        let torrentName = torrent.name;
        callback.log(torrentName);
        return torrentName;
      });
    };

  this.play = function(magnet){
      var magnetURI = magnet;
      return this.request(magnet);
   };
});