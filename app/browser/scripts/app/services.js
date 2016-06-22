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
      let folder = __dirname+"/"+dir;
      console.log(folder);
      fs.unlink(folder);
     };
});

myApp.service('kat', function( $q,$routeParams ){
  
  this.brightnessCheck = function(imageSrc,callback) {
      var img = document.createElement("img");
      img.src = imageSrc;
      img.style.display = "none";
      document.body.appendChild(img);

      var colorSum = 0;

      img.onload = function() {
          // create canvas
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(this,0,0);

          var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
          var data = imageData.data;
          var r,g,b,avg;

            for(var x = 0, len = data.length; x < len; x+=4) {
              r = data[x];
              g = data[x+1];
              b = data[x+2];

              avg = Math.floor((r+g+b)/3);
              colorSum += avg;
          }

          var brightness = Math.floor(colorSum / (this.width*this.height));
          callback(brightness);
      }
  }
  /* To put in the controller */
  var img = document.body.getElementsByTagName('img');
  getImageBrightness(this.src,function(brightness) {
    document.getElementsByTagName('pre')[0].innerHTML = "Brightness: "+brightness;
  });            
});
myApp.service('kat', function( $q,$routeParams ){
  const kickass = require('kickass-torrent');

  function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  this.query = function(query , season , episode){
      var deferred = $q.defer();
      season = (season < 10 ? '0'+season : season);
      episode = (episode< 10? '0'+episode : season);

      kickass({
          q: `${query} S${season}E${episode}`,//actual search term
          field:'seeders',//seeders, leechers, time_add, files_count, empty for best match
          order:'desc',//asc or desc
          page: 1,//page count, obviously
          url: 'https://kat.al',//changes site default url (https://kat.cr)
          },function(e, data){
              //will get the contents from
              //http://kickass.to/json.php?q=test&field=seeders&order=desc&page=2
              if(e){
                console.log(data)//actual json response
              }
              var final = [];
              final.push(data.list[0]);
              final.push(data.list[1]);
              final.push(data.list[2]);

              final[0].size = formatBytes(final[0].size);
              final[1].size = formatBytes(final[1].size);
              final[2].size = formatBytes(final[2].size);
              console.log(final);
              deferred.resolve(final);
          })
      return deferred.promise;
    }

});


myApp.service('tmdb', function($http ,  $routeParams){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";




  this.fetchTmdb = function(platform = "tv", type , query , page){
    console.log(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
    return $http.get(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
  }

  this.tvFeed = function(type , page){
    console.log(`${url}/tv/${type}?${apiKey}&page=${page}`);
    return $http.get(`${url}/tv/${type}?${apiKey}&page=${page}`);
  }

  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}`);
    return $http.get(`${url}/tv/${$routeParams.tvId}?${apiKey}`);
  }

  this.tvSeason = function(season = $routeParams.season){
    console.log(`${url}/tv/${$routeParams.tvId}/season/${$routeParams.season}?${apiKey}`);
    return $http.get(`${url}/tv/${$routeParams.tvId}/season/${season}?${apiKey}`);
  }

  this.tvEpisode = function(){
    console.log(`${url}/tv/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`);
    return $http.get(`${url}/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${apiKey}`);
  }

  this.tvDiscover = function (...terms){
    //airDateMin="1980-01-01" ,airDateMax="2016-06-20" , firstReleaseMin="1980-01-01" , firstReleaseMax="2016-06-20" , year=2016 , page=1 , sortBy="popularity.desc" ,voteMin=0 ,voteMax=10 , genre
      var termArray = [];
        terms.forEach(function (item) {
          termArray.push(item);
        });
        console.log(`${url}/discover/tv?${termArray.join("&")}&${apiKey}`);
    return $http.get(`${url}/discover/tv?${termArray.join("&")}&${apiKey}`);
  }

  this.tvSearch = function(query , page ){
    return $http.get(`${url}/search/tv?query=${query}&page=${page}&${apiKey}`);
  }

});

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

myApp.service('window', function() {
  const remote = require('electron').remote;
  const {BrowserWindow} = require('electron').remote
  this.open = function( platform , url ){
    var popup = new BrowserWindow({
                  width: 1280,
                 height: 724,
                 frame:false,
                  show: false
                 //type: "textured"
               });
    // and load the index.html of the app.
    popup.loadURL(`file://${__dirname}/index.html#/${platform}/${url}`);
    // Open the DevTools.
    popup.webContents.openDevTools();
    popup.webContents.on('did-finish-load', function() {
      setTimeout(function(){
        popup.show();
      }, 40);
    })
    //window.open(`#/${platform}/${url}`, `${platform}` ,"resizable,scrollbars,status,width=1280,height=720");
  }

   this.minimize = function() {
     const window = remote.getCurrentWindow();
     window.minimize();
   }

   this.maximize = function() {
     const window = remote.getCurrentWindow();
     if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
   }

   this.close = function() {
     const window = remote.getCurrentWindow();
     window.close();
   };
});

myApp.service('yify', function($http){

  const listMovies = "http://yify.is/api/v2/list_movies.json";
  const movieDetails = "http://yify.is/api/v2/movie_details.json";

  this.listMovies = function(sortBy,genre,query){
    return $http.get(`${listMovies}?query_term=${query}&genre=${genre}&sort_by=${sortBy}&limit=50&order_by=desc`);
  }

  this.movieDetails = function(id){
    return $http.get(`${movieDetails}?movie_id=${id}&with_images=true&with_cast=true`);
  }

});
