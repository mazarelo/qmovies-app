myApp.service('webTorrent', function(folder ,video , $q , folder) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();
  const notVideoFiles = ["jpg","jpeg","png","txt","gif"];

  this.play = function(magnet){
    /* player */
      const videoPlayer = document.querySelector("#video-placeholder");
      const loader = document.querySelector(".video-loader");
      const infoTarget = document.querySelector(".info-content");
      /* torrent info */
      const torrentDownloadSpeed = document.getElementById("torrent-download-speed");
      const torrentDownloadBites = document.getElementById("torrent-downloaded");
      const torrentProgress = document.getElementById("torrent-progress");
      const timeRemaining = document.getElementById("torrent-time");

      document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
      infoTarget.classList.toggle('ng-hide');
      loader.classList.toggle('ng-hide');

      var magnetURI = magnet;
      var deferred = $q.defer();

      client.add( magnetURI , {path: __dirname+"/downloads/temp"} , function(torrent) {
        videoPlayer.innerHTML = "";
        var final = [];

        for(var i=0;i < torrent.files.length; i++){
          var currentTorrent = torrent.files[i];
          var checkExtension = currentTorrent.name.split(".");
          
          if(notVideoFiles.indexOf(checkExtension[checkExtension.length])){
            console.log("image found");
          }

          if(currentTorrent['length'] <= 100000000){
            //delete file;
          }else{
            final.push(torrent.files[i]);
          }
        }

        var once = false;
        /* start seeding a torrent */
        try{
          client.seed(final, function (torrent) {
            console.log('Client is seeding:', torrent.infoHash)
          });
        }catch(err){
          console.log(err);
        }

        try{
        /* download torrent */
        torrent.on('download', function (bytes) {
          torrentDownloadBites.textContent =  Math.floor( torrent.progress*100);
          torrentProgress.value = Math.floor( torrent.progress*100);
          timeRemaining.textContent = video.milisecondsToReadable(torrent.timeRemaining);

          if(Math.floor( torrent.progress*100) >= 2){
            if(once){
              return
            }

            once = true;
            console.log(final);

            final[0].appendTo("#video-placeholder", { maxBlobLength: 2 * 1000 * 1000 * 1000 } , function(err, elem) {
              console.log(err);
              document.querySelector("#video-placeholder video").src = final[0].path[0];
            });
            /* place downloading bar at top */
            document.getElementById("torrent-wrapper").classList.toggle("top");

            videoPlayer.className = "";
            videoPlayer.removeAttribute("style");
            loader.classList.toggle('ng-hide');
            infoTarget.style.visibility = "hidden";
            deferred.resolve(torrent.name);
          }
        });
      }catch(err){
        console.log(err);
      }

       });
      return deferred.promise;
   };
});
