
myApp.service('downloadTorrent', function(fileSystem , notifications, $routeParams, windows , $q , $filter, $rootScope){
  const self = this;
  var WebTorrent = require('webtorrent')
  var client = new WebTorrent();
  self.requestRunning = false;
  var videoBlobUrl = false;
  
  self.download = function(magnet , id , season , episode){
    var deferred = $q.defer();
    var magnetURI = magnet;
    var progressBarId = `${id}-${season}-${episode}`;
    var serieTitle = document.querySelector(".title").textContent;
    /* set item img to download */
    let downloadIcon = document.getElementById(progressBarId).parentNode.parentNode.getElementsByTagName('img')[0];
    downloadIcon.src = "assets/img/loading.svg";
    downloadIcon.classList.add("rotation");
    /* prevent torrent duplication error */
    if(client.get(magnetURI) == null && $rootScope.online == true){
      client.add(magnetURI, { path: `${process.env.DOWNLOAD_PATH}/tv/${$routeParams.tvId}/season-${season}/episode-${episode}` }, function (torrent) {
        self.requestRunning = true;

        if(!videoBlobUrl){
          fileSystem.findAllWithMovieExtension(torrent.path , function(filename){
            console.log('-- found: ',filename);
            windows.open("file://"+filename);
          })
        };

        notifications.new(`Season ${season} Episode ${episode} is downloading...` , "" , serieTitle , function(title){
          console.log("new torrent notification sent ");
        });

        torrent.files.forEach(function(item){
          console.log(item);
          self.hash = item._torrent.infoHash;
        });

        /* on torrent download update date */
        torrent.on('download', function (bytes) {
          //console.log('just downloaded: ' + bytes)
          //console.log('total downloaded: ' + torrent.downloaded);
          //console.log('download speed: ' + torrent.downloadSpeed);

          try{
            document.getElementById("speed-"+progressBarId).textContent = $filter('formatBytes')(torrent.downloadSpeed)+"/s";
          }catch(err){
            console.log("SpeedErr:",err);
          }

          try{
            document.getElementById(progressBarId).value = torrent.progress;
          }catch(err){
            console.log(err);
          }
        });
        /* when torrent is Done */
        torrent.on('done', function () {
          self.requestRunning = false;
          torrent.pause();
          document.getElementById("speed-"+progressBarId).textContent = "";
          notifications.new(`Season ${season} Episode ${episode} is Complete!` , "" , serieTitle , function(){
            fileSystem.findAllWithMovieExtension(torrent.path , function(filename){
              console.log('-- found: ',filename);
              windows.open("file://"+filename);
            })
          });
          deferred.resolve(true);
        });

        /* when torrent has no peers */
        torrent.on('noPeers', function (announceType) {
          self.requestRunning = false;
          console.log("No peers detected", announceType);
          notifications.new("We cannot find peers to download" , "" ,"No peers");
        });
      });
    };
    /* Client on error emmit alert and remove old torrent */
    client.on('error', function (err) {
      console.log("Error",err);
      downloadIcon.src = "assets/img/download.svg";
      notifications.new(err , "" ,"Error");
      self.requestRunning = false;
    })

    return deferred.promise;
  }

  self.findTorrentsById = function(id){
    console.log("nothing here");
  }

});
