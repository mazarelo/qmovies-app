myApp.service('webTorrent', function(folder ,video , $q) {
  const WebTorrent = require('webtorrent');
  const client = new WebTorrent();

  this.play = function(magnet){
    var deferred = $q.defer();
    /* player */
    const videoPlayer = document.querySelector("#video-placeholder");
    const infoTarget = document.querySelector(".info-content");
    /* torrent info */
    const magnetURI = magnet;
    const torrentDownloadSpeed = document.getElementById("torrent-download-speed");
    const torrentDownloadBites = document.getElementById("torrent-downloaded");
    const torrentProgress = document.getElementById("torrent-progress");
    const timeRemaining = document.getElementById("torrent-time");

    document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
    infoTarget.classList.toggle('ng-hide');
    console.log(process.env.DOWNLOAD_PATH);
    //client.add( magnetURI , {path: __dirname+"/downloads/temp"} , function(torrent) {
    client.add( magnetURI , {path: process.env.DOWNLOAD_PATH } , function(torrent) {
      console.log("Client torrent added");
      videoPlayer.innerHTML = "";
      var final = [];

        /* use forEach as an aleternative
        for(var i=0;i < torrent.files.length; i++){
          var currentTorrent = torrent.files[i];
          if(currentTorrent['length'] <= 100000000){
            //delete file;
          }else{
            final.push(torrent.files[i]);
          }
        } */

      torrent.files.forEach(function(element, index){
        console.log("files:");
        console.log(torrent.files[index]);
        var currentTorrent = torrent.files[index];
        if(currentTorrent['length'] <= 100000000){
          //delete file;
        }else{
          final.push(torrent.files[index]);
        }
      });

      var once = false;

      torrent.on('download', function (bytes) {
        torrentDownloadBites.textContent =  Math.floor( torrent.progress*100);
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
          infoTarget.style.visibility = "hidden";
          let torrentName = torrent.name;
          deferred.resolve(torrentName);
        }
      });
    });
    return deferred.promise;
   };
});
