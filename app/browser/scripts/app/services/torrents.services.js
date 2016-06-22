myApp.service('webTorrent', function(folder , $q) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();

  this.play = function(magnet){
    /* player */
      const videoPlayer = document.querySelector("#video-placeholder");
      const loader = document.querySelector(".video-loader");
      const infoTarget = document.querySelector(".info-content");
      /* torrent info */
      const torrentDownloadSpeed = document.getElementById("torrent-download-speed");
      const torrentDownloadBites = document.getElementById("torrent-downloaded");
      const torrentProgress = document.getElementById("torrent-progress");


      infoTarget.classList.toggle('ng-hide');
      loader.classList.toggle('ng-hide');

      var magnetURI = magnet;
      var deferred = $q.defer();
      client.add( magnetURI , {path: __dirname+"/downloads/temp"} , function(torrent) {
        videoPlayer.innerHTML = "";
        var final = [];
        for(var i=0;i < torrent.files.length; i++){
          var currentTorrent = torrent.files[i];
          if(currentTorrent['length'] <= 100000000){
            //delete file;
          }else{
            final.push(torrent.files[i]);
          }
        }
        var once = false;

        torrent.on('download', function (bytes) {
          torrentDownloadBites.textContent =  Math.floor( torrent.progress*100);
          torrentProgress.value = Math.floor( torrent.progress*100);
          if(Math.floor( torrent.progress*100) >=5){
            if(once){
              return
            }
            once = true;
            final[0].appendTo(videoPlayer);
            videoPlayer.className = "";
            videoPlayer.removeAttribute("style");
            loader.classList.toggle('ng-hide');
            infoTarget.style.visibility = "hidden";
            let torrentName = torrent.name;
            deferred.resolve(torrentName);
          }
        });


       });
      return deferred.promise;
   };
});
