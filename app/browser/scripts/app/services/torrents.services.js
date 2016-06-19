myApp.service('webTorrent', function(folder , $q) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();
  const player = document.querySelector("#video-placeholder");
  const loader = document.querySelector(".loading");
  const playBtn = document.querySelector(".quality");

  this.play = function(magnet){

    playBtn.classList.toggle('ng-hide');
    loader.classList.toggle('ng-hide');

    var magnetURI = magnet;
    var deferred = $q.defer();
    client.add( magnetURI , {path: __dirname+"/downloads/temp"} , function(torrent) {
      player.innerHTML = "";
      var final = [];
      for(var i=0;i < torrent.files.length; i++){
        var currentTorrent = torrent.files[i];

        if(currentTorrent['length'] <= 100000000){
          //delete file;
        }else{
          final.push(torrent.files[i]);
        }
      }
       final[0].appendTo(player);
       player.className = "";
       player.removeAttribute("style");
       loader.classList.toggle('ng-hide');

       let torrentName = torrent.name;
       deferred.resolve(torrentName);
     });
    return deferred.promise;
   };
});
