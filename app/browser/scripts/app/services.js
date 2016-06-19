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
  const kickass = require('kickass-torrent');

  function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


  this.query = function(query){
      var deferred = $q.defer();
      kickass({
          q: `${query} S01E01`,//actual search term
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

  this.tvSeason = function(){
    console.log(`${url}/tv/${$routeParams.tvId}/season/${$routeParams.season}?${apiKey}`);
    return $http.get(`${url}/${$routeParams.tvId}/season/${$routeParams.season}?${apiKey}`);
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
    var trayImage;
    var imageFolder = __dirname + '/app/browser/assets/img/global/iMac-icon.png';

    // Determine appropriate icon for platform
    if (platform == 'darwin') {
        trayImage = imageFolder ;
    }
    else if (platform == 'win32') {
        trayImage = imageFolder;
    }
    appIcon = new Tray(trayImage);

    if (platform == "darwin") {
      appIcon.setPressedImage(imageFolder);
    }

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
