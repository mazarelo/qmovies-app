/* API END POINTS
"https://api-fetch.website/tv/shows/1"
"https://api-fetch.website/tv/show/:id"
*/
myApp.service('tvTorrents', function($http){
  const self = this;

  self.getTorrentsByImdbId = function(id){
      console.log(id);
      return $http.get(`https://api-fetch.website/tv/show/${id}`);
  }

});

myApp.service('cache', function( $localStorage){

  this.save = function(name , data , timeToLive){
    var returnData;
    if(name){
      returnData = $localStorage[name];
    }else{
      $localStorage[name] = data;
      $localStorage[name].push({time_to_live: timeToLive});
      returnData = $localStorage[name];
    }
    return returnData;
  }

  this.get = function(name){
    if($localStorage[name]){
      console.log("Cached obj:",$localStorage[name])
      return $localStorage[name];
    }
    return false;
  }

  this.delete = function(name){
    delete $localStorage[name];
  }

  this.alter = function(name , data){
    $localStorage[name] = data;
  }

});


myApp.service('downloadTorrent', function(fileSystem , notifications, $routeParams, windows , $q , $filter){
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

    /* prevent torrent duplication error */
    if(client.get(magnetURI) == null){
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

myApp.service('fileSystem', function($q){
  const self = this;
  const fs = require('fs');
  const path = require('path');

  const APP_FILES = process.env.APP_FILES;

  self.newFolder = function(name){
    console.log( APP_FILES+"/"+name );

    fs.mkdir(APP_FILES+"/"+name, function (err) {
      if (err) {
          return console.log('failed to write directory', err);
      }
    });
  };

  self.findAllWithMovieExtension = function(startPath , callback){
    var extensions = [ /\.mkv$/ , /\.mp4$/ ];
    // /\.mkv$/ ,
    //console.log('Starting from dir '+startPath+'/');
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){

            self.findAllWithMovieExtension(filename,callback); //recurse
        }
        else{
          extensions.forEach(function(ext){
            if(ext.test(filename)) {
              callback(filename);
            }
          });
        }
    };
  };


  self.listAll = function(path){
    try{
      var files = fs.readdirSync(APP_FILES+"/"+path);
    }catch(err){
      console.log(err);
    }
    return files;
  };

  self.fileExists = function(path){
    try{
      fs.stat(APP_FILES+"/"+path+".json", function(err, stats){
        console.log(stats);
      });
    }catch(e){
      console.log(e);
    }
  };

  self.removeFile = function(path){
    var deferred = $q.defer();
    let file = APP_FILES+"/"+path;
    console.log( file );
    fs.unlink(file , function (err , data){
      if (err) {
        deferred.resolve("There is no File!");
      }
      deferred.resolve(JSON.parse(data));
    });
    return deferred.promise;
  };

  self.removeFolder = function(dir){
    let folder = APP_FILES+"/"+dir;
    console.log( folder );
    fs.unlink(folder);
  };

  self.readJson = function(file){
    var deferred = $q.defer();
    fs.readFile( APP_FILES+"/"+file+".json", 'utf8', function (err, data) {
      if (err) {
        deferred.resolve("There is no File!");
      }

      deferred.resolve(JSON.parse(data));
    });
    return deferred.promise;
  };

  self.createJsonFile = function(name , data){
    fs.writeFile(APP_FILES+"/"+name+".json", data , function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      });
  };

  self.checkLastModified = function(name){

  }

  self.deleteFolderRecursive = function(path) {
      var files = [];
      if( fs.existsSync(path) ) {
          files = fs.readdirSync(path);
          files.forEach(function(file,index){
              var curPath = path + "/" + file;
              if(fs.lstatSync(curPath).isDirectory()) { // recurse
                  deleteFolderRecursive(curPath);
              } else { // delete file
                  fs.unlinkSync(curPath);
              }
          });
          fs.rmdirSync(path);
      }
  };

});


myApp.service('nightmare', function($q){
  const self = this;

  var jquery = require('jquery'),
      Nightmare = require('nightmare');

  self.scrapeLinkFromProvider = function(url = "" , scrapeSelector = ""){
    console.log("Inside Nightmare");
    var nightmare = Nightmare();
    /* test url = 'http://streamin.to/2io0duwvz10t' */
    var url = "http://streamin.to/2io0duwvz10t";

    nightmare.goto(url)
    .wait(7000)
    .click('#btn_download')
    .wait(5000)
    .evaluate(function(){
      console.log("inside evalutate");
      var scriptedData = document.querySelector('div.cont_mdl > script:nth-child(5)').textContent.replace(/\s/g, '');
      var getFile =  scriptedData.substring( scriptedData.lastIndexOf("file:")+6, scriptedData.indexOf("image:")-2 );
      return new Promise((resolve, reject) => {
             setTimeout(() => resolve(getFile), 2000);
        }, selector)
    })
    .end()
    .then((response)=>{
      console.log("NIGHTMARE:",response);
    })
  }
});

myApp.service('notifications', function(){
  const self = this;
  self.new = function(theBody,theIcon, theTitle , cb = "") {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle , options);
    // If the user clicks in the Notifications Center, show the app
    n.onclick = function () {
      options.title = theTitle;
      cb(options);
    }
    setTimeout(n.close.bind(n), 5000);
  }

});

myApp.service('providers', function(streamin , $filter , $q){
  const self = this;

  self.filterProviders = function(provider){
    var deferred = $q.defer();
    let providerFiltered = $filter('getDomain')(provider);

    switch(providerFiltered){
      case "streamin":
        console.log("inside streamin");
         deferred.resolve( streamin.getFileUrl(provider) );
      break;
      case "vidto":
        deferred.resolve( streamin.getFileUrl(provider) );
      break;
      case "vidtodo":
        deferred.resolve( streamin.getFileUrl(provider) );
      break;
    }
    return deferred.promise;
  }

});

myApp.service('streamin', function(nightmare, $q){
  const self = this;

  self.getFileUrl = function(url){
  
  }
});

myApp.service('tmdb', function($http , $routeParams , $q , cache ){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";

  this.imgRoute = imgUrl;

  /* defered kit
  var deferred = $q.defer();
  deferred.resolve(data);
  return deferred.promise;
  */

  /* NEEDS WORK ON IT! FIND A WAY OF STORING FILES IF NOT STORED ON THE SERVICES LEVEL */
  this.fetchTmdb = function(platform = "tv", type , query , page){
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
       return $http.get(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`)
    }
    return deferred.promise;
    //console.log(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}&append_to_response=external_ids`);
  }

  this.getCastFromTvId = function(tvId){
    console.log(`${url}/tv/${tvId}/credits?${apiKey}`);
    return $http.get(`${url}/tv/${tvId}/credits?${apiKey}`);
  }

  this.searchByImdbId = function(imdbId){
    console.log(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    return $http.get(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
  }

  this.tvFeed = function(type , page){
    //console.log(`${url}/tv/${type}?${apiKey}&page=${page}`);
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    /*if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
    */
      return $http.get(`${url}/tv/${type}?${apiKey}&page=${page}`);
    /*}*/

    return deferred.promise;
  }

  this.movieFeed = function(type , page){
    console.log(`${url}/movie/${type}?${apiKey}&page=${page}`);
    return $http.get(`${url}/movie/${type}?${apiKey}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${url}/tv/${$routeParams.tvId}/external_ids?${apiKey}`);
  }

  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
    return $http.get(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
  }

  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${url}/tv/${id}/season/${season}?${apiKey}`);
    return $http.get(`${url}/tv/${id}/season/${season}?${apiKey}`);
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

  this.movieSearch = function(query , page ){
    return $http.get(`${url}/search/movies?query=${query}&page=${page}&${apiKey}`);
  }
});

myApp.service('windows', function() {
  const remote = require('electron').remote;
  const {BrowserWindow} = require('electron').remote;

  this.open = function(url){
    var popup = new BrowserWindow({
      width: 1280,
      height: 724,
      show: true
      //type: "textured"
    });

    // and load the index.html of the app.
    popup.loadURL(`${url}`);
    // Open the DevTools.
    popup.webContents.openDevTools();
    popup.webContents.on('did-finish-load', function() {
      setTimeout(function(){
        popup.show();
      }, 40);
    })
    //window.open(`#/${platform}/${url}`, `${platform}` ,"resizable,scrollbars,status,width=1280,height=720");
  }

  this.scrollToTop = function(scrollDuration) {
    let feedEl = document.getElementById("feed-ajax");
    currentScrollTop = feedEl.scrollTop;
    let scrollStep = feedEl.scrollTop / (scrollDuration / 15);

    let scrollInterval = setInterval(function(){
      if (feedEl.scrollTop != 0 ) {
        console.log(feedEl.scrollTop);
        feedEl.scrollTop = feedEl.scrollTop - scrollStep;
      }
      else clearInterval(scrollInterval);
    },15);
  }

  this.minimize = function() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  this.maximize = function() {
    const window = remote.getCurrentWindow();

    if(window.isFullScreen()){
      window.setFullScreen(false);
    }else{
      window.setFullScreen(true);
    }

    /*if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }*/

  }

  this.close = function() {
    const window = remote.getCurrentWindow();
    window.close();
  };

});

myApp.service('yify', function($http){

  const listMovies = "https://yts.ph/api/v2/list_movies.json";
  const movieDetails = "https://yts.ph/api/v2/movie_details.json";

  this.listMovies = function( sortBy, genre ){
    return $http.get(`${listMovies}?&genre=${genre}&sort_by=${sortBy}&limit=50`);
  }

  this.querySearch = function(query){
    return $http.get(`${listMovies}?query_term=${query}`);
  }

  this.movieDetails = function( id ){
    return $http.get(`${movieDetails}?movie_id=${id}&with_images=true`);
  }

});
