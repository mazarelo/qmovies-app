myApp.service('webTorrent', function(folder , video , $q , notifications) {
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

        /* torrent info */
        torrentDownloadSpeed.textContent = self.kbsToReadable( Math.floor( torrent.downloadSpeed) , true);
        torrentProgress.value = Math.floor( torrent.progress/100 );
        timeRemaining.textContent = video.milisecondsToReadable( torrent.timeRemaining/100 );
        /* end */

        if(Math.floor( torrent.progress*100) >= 2){
          if(once) return;
          once = true;

          final[0].appendTo("#video-placeholder",{ maxBlobLength: 2* 1000 * 1000 * 1000 }, function(err, elem) {
            if(err){
              notifications.new("Format Unsupported","theIcon","Failed to Play");
            }
            
            document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
          });

          videoPlayer.className = "";
          videoPlayer.removeAttribute("style");
          document.querySelector(".info-content").style.visibility = "hidden";
          let torrentName = torrent.name;
         return deferred.resolve(torrentName);
        }
      });
      /* when torrent is finished */
      torrent.on('done', function(){
        notifications.new("Video finished downloading","theIcon","Qmovies");
      });

    });
   }

   self.kbsToReadable = function(bytes, si){
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u]+' p/s';
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


   self.stopAllTorrents = function(){
    client.destroy([function callback (err) {
      console.log("Destroying Client",err);
    }]);
   }

});
