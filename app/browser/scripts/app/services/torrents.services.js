myApp.service('webTorrent', function(folder , $q) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();
  const player = document.getElementById("player");
  this.play = function(magnet){
      var magnetURI = magnet;
      var deferred = $q.defer();
      client.add( magnet , {path: __dirname+"/downloads/temp"} , function(torrent) {
        player.innerHTML = "";
        var final = [];
        for(var i=0;i < torrent.files.length; i++){
          var tor = torrent.files[i].name;
          tor = tor.split(".");
          if(tor[tor.length-1] == "jpg"){
            //delete file;
          }else{
            final.push(torrent.files[i]);
          }
        }
         final[0].appendTo(player);
         let torrentName = torrent.name;
         deferred.resolve(torrentName);
       });
      return deferred.promise;
   };
});
