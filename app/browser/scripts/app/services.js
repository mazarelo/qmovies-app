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

  self.getTvList = function(page){
      console.log(page);
      return $http.get(`https://api-fetch.website/tv/shows/${page}`);
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


myApp.service('downloadTorrent', function(fileSystem , notifications, $routeParams, windows , $q , $filter, $rootScope , userSettings){
  const self = this;
  var WebTorrent = require('webtorrent')
  var client = new WebTorrent();
  self.requestRunning = false;
  var videoBlobUrl = false;
  self.downloadFolder = false;
  var serieTitle = document.querySelector(".title").textContent;

  userSettings.get("user.downloadFolder").then(val =>{
      console.log("Download:",val);
      self.downloadFolder = val;
  })

  self.download = function(magnet , id , season , episode){
    var deferred = $q.defer();
    var magnetURI = magnet;
    var progressBarId = `${id}-${season}-${episode}`;
    /* set item img to download */
    let downloadIcon = document.getElementById(progressBarId).parentNode.parentNode.getElementsByTagName('img')[0];
    downloadIcon.src = "assets/img/loading.svg";
    downloadIcon.classList.add("rotation");
    /* prevent torrent duplication error */
    if(client.get(magnetURI) == null && $rootScope.online == true && self.downloadFolder){
      client.add(magnetURI, { path: `${self.downloadFolder}/tv/${$routeParams.tvId}/season-${season}/episode-${episode}` }, function (torrent) {
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

          /* destroy the torrent */
          torrent.destroy();
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

myApp.service('fileSystem', function($q , userSettings){
  const self = this;
  const fs = require('fs');
  const path = require('path');
  var APP_FILES = process.env.APP_FILES;

  userSettings.get("user.downloadFolder").then(val =>{
      console.log("Download folder from Settings:", val);
      APP_FILES = val;
  })

  self.newFolder = function(name){
    console.log( APP_FILES );
    fs.mkdir( name, function (err) {
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
      return fs.existsSync(APP_FILES+"/"+path);
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
    let folder = dir;
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

  self.deleteFolderRecursively = function(path) {
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

  self.moveFiles = function(oldPath, newPath, cb){
    return fs.rename(oldPath, newPath, cb())
  }

});


myApp.service('ipc', function($http){
  const self = this;
  const {ipcRenderer} = require('electron');

  self.openDialog = function(id, data){
    return ipcRenderer.sendSync(id, data)
  }

  self.openFoldersDialog = function(){
    return ipcRenderer.sendSync("open-folder", "download-path");
  }

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
        icon: theIcon,
        silent: true
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

myApp.service('userSettings', function(nightmare, $q){
  const self = this;
  const settings = require('electron-settings');
  /* settings.getSettingsFilePath(); */

  self.getUserName = function(){
    return settings.get('name.first').then(val => {
      console.log(val);
    });
  }

  self.cacheStatus = function(){
    return settings.get('user.cache')
  }

  self.maxQualityStatus = function(){
    return settings.get('user.maxQuality')
  }

  self.clearDownloadsOnExitStatus = function(){
    return settings.get('user.deleteDownloadsOnExit')
  }

  self.get = function(name){
    return settings.get(name);
  }

  self.set = function(name,data){
    return settings.set(name,data);
  }

  self.create = function(name ,obj){
    settings.set('name', {
      first: 'Cosmo',
      last: 'Kramer'
    }).then(() => {
      settings.get('name.first').then(val => {
        console.log(val);
        // => "Cosmo"
      });
    });

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
  const self = this;

  this.api = {
    key: "api_key=7842e553f27c281212263c594f9504cf",
    endPoint: "https://api.themoviedb.org/3",
    personUrl: "https://api.themoviedb.org/3/person/",
    imgUrl: "http://image.tmdb.org/t/p/"
  }

  this.imgRoute = {
      w150: self.api.imgUrl+"w300",
      w300: self.api.imgUrl+"w300",
      w500: self.api.imgUrl+"w500",
      w1920: self.api.imgUrl+"w1920"
  };
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
       return $http.get(`${this.api.endPoint}/${type}?${query}&${this.api.key}&${this.api.key}&page=${page}`)
    }
    return deferred.promise;
    //console.log(`${this.api.endPoint}/${type}?${query}&${this.api.key}&${this.api.key}&page=${page}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
  }

  this.searchById = function(id = $routeParams.tvId){
    console.log(`${this.api.endPoint}/tv/${id}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}?${this.api.key}&append_to_response=external_ids`);
  }

  this.getCastFromTvId = function(tvId){
    console.log(`${this.api.endPoint}/tv/${tvId}/credits?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${tvId}/credits?${this.api.key}`);
  }

  this.searchByImdbId = function(imdbId){
    console.log(`${this.api.endPoint}/find/${$routeParams.tvId}?${this.api.key}&language=en-US&external_source=imdb_id`);
    return $http.get(`${this.api.endPoint}/find/${$routeParams.tvId}?${this.api.key}&language=en-US&external_source=imdb_id`);
  }

  this.tvFeed = function(type , page){
    //console.log(`${this.api.endPoint}/tv/${type}?${this.api.key}&page=${page}`);
    var deferred = $q.defer();
    let storeName = type+"-"+page;
    /*if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
    */
      return $http.get(`${this.api.endPoint}/tv/${type}?${this.api.key}&page=${page}`);
    /*}*/

    return deferred.promise;
  }

  this.movieFeed = function(type , page){
    console.log(`${this.api.endPoint}/movie/${type}?${this.api.key}&page=${page}`);
    return $http.get(`${this.api.endPoint}/movie/${type}?${this.api.key}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${this.api.endPoint}/tv/${$routeParams.tvId}/external_ids?${this.api.key}`);
  }

  this.tvSerie = function(){
    console.log(`${this.api.endPoint}/tv/${$routeParams.tvId}?${this.api.key}&append_to_response=external_ids`);
    return $http.get(`${this.api.endPoint}/tv/${$routeParams.tvId}?${this.api.key}&append_to_response=external_ids`);
  }

  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${this.api.endPoint}/tv/${id}/season/${season}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/tv/${id}/season/${season}?${this.api.key}`);
  }

  this.tvEpisode = function(){
    console.log(`${this.api.endPoint}/tv/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${this.api.key}`);
    return $http.get(`${this.api.endPoint}/${$routeParams.tvId}/season/${$routeParams.season}/episode/${$routeParams.episode}?${this.api.key}`);
  }

  this.tvDiscover = function (...terms){
    //airDateMin="1980-01-01" ,airDateMax="2016-06-20" , firstReleaseMin="1980-01-01" , firstReleaseMax="2016-06-20" , year=2016 , page=1 , sortBy="popularity.desc" ,voteMin=0 ,voteMax=10 , genre
      var termArray = [];
        terms.forEach(function (item) {
          termArray.push(item);
        });
        console.log(`${this.api.endPoint}/discover/tv?${termArray.join("&")}&${this.api.key}`);
    return $http.get(`${this.api.endPoint}/discover/tv?${termArray.join("&")}&${this.api.key}`);
  }

  this.tvSearch = function(query , page ){
    return $http.get(`${this.api.endPoint}/search/tv?query=${query}&page=${page}&${this.api.key}`);
  }

  this.movieSearch = function(query , page ){
    return $http.get(`${this.api.endPoint}/search/movies?query=${query}&page=${page}&${this.api.key}`);
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
