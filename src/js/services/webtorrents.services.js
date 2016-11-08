myApp.service('webTorrent', function(folder ,video , $q) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();
  const self = this;

  var once = false;
  var deferred = $q.defer();
  var final = [];

  self.play = function(magnet){
    self.add(magnet);
    return deferred.promise;
   };

   self.add = function(magnet){
    /* player */
    const magnetURI = magnet;
    /* torrent info */
    const torrentDownloadSpeed = document.getElementById("torrent-download-speed");
    //const torrentDownloadBites = document.getElementById("torrent-downloaded");
    const torrentWrapper = document.getElementById("torrent-wrapper");
    const infoTarget = document.querySelector(".info-content");

    torrentWrapper.classList.toggle("ng-hide");
    infoTarget.classList.toggle('ng-hide');

    client.add( magnetURI , {path: process.env.DOWNLOAD_PATH } , function(torrent){
      torrent = self.filterFiles(torrent);

      torrent.on('download', function(bytes){
        const torrentProgress = document.getElementById("torrent-progress");
        const timeRemaining = document.getElementById("torrent-time");
        const videoPlayer = document.querySelector("#video-placeholder");

        torrentProgress.value = Math.floor( torrent.progress*100);
        timeRemaining.textContent = video.milisecondsToReadable(torrent.timeRemaining);

        if(Math.floor( torrent.progress*100) >= 1){
          if(once) return;

          once = true;

          final[0].appendTo("#video-placeholder",{ maxBlobLength: 2* 1000 * 1000 * 1000 }, function(err, elem) {
            console.log(err);
            document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
          });

          videoPlayer.className = "";
          videoPlayer.removeAttribute("style");
          document.querySelector(".info-content").style.visibility = "hidden";
          let torrentName = torrent.name;
         return deferred.resolve(torrentName);
        }
      });
    });
   }

   self.filterFiles = function( torrent ){
      document.querySelector("#video-placeholder").innerHTML = "";
      torrent.files.forEach(function(element, index){
        var currentTorrent = torrent.files[index];
        if(currentTorrent['length'] <= 100000000){
          //delete file;
        }else{
          final.push(torrent.files[index]);
        }
      });

      return torrent;
   }

   /* on download data */
   self.onDownload = function(torrent){
      const torrentProgress = document.getElementById("torrent-progress");
      const timeRemaining = document.getElementById("torrent-time");
      const videoPlayer = document.querySelector("#video-placeholder");

      torrentProgress.value = Math.floor( torrent.progress*100);
      timeRemaining.textContent = video.milisecondsToReadable(torrent.timeRemaining);

      if(Math.floor( torrent.progress*100) >= 1){
        if(once) return;

        once = true;

        final[0].appendTo("#video-placeholder",{ maxBlobLength: 2* 1000 * 1000 * 1000 }, function(err, elem) {
          console.log(err);
          document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
        });

        videoPlayer.className = "";
        videoPlayer.removeAttribute("style");
        document.querySelector(".info-content").style.visibility = "hidden";
        let torrentName = torrent.name;
       return deferred.resolve(torrentName);
      }

   }
});
