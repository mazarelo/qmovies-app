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

myApp.service('folder', function($q){
  const self = this;
  const fs = require('fs');
  const APP_FILES = process.env.APP_FILES+"\\jsonCache";

  self.new = function(name){
    console.log( APP_FILES+"/"+name );

    fs.mkdir(APP_FILES+"/"+name, function (err) {
      if (err) {
          return console.log('failed to write directory', err);
      }
    });
  };

  self.listAll = function(){
    console.log( fs.readdirSync(APP_FILES) );
    var folder = APP_FILES;
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

});


myApp.service('nightmare', function($q){
  const self = this;

  var jquery = require('jquery'),
      Nightmare = require('nightmare');


  self.scrapeLinkFromProvider = function(url , scrapeSelector){
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
      return getFile;
    })
    .end()
    .then(function(response){
      console.log("from Nightmare:", response)
      return response ;
    })
  }

});

myApp.service('notifications', function(){
  const self = this;
  self.new = function(theBody,theIcon,theTitle) {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle,options);
    // If the user clicks in the Notifications Center, show the app
    n.onclick = function () {
      ipcRenderer.send('focusWindow', 'main')
    }
    setTimeout(n.close.bind(n), 5000);
  }

});

myApp.service('providers', function(streamin , $filter , $q){
  const self = this;

  self.filterProviders = function(provider){
    var deferred = $q.defer();
    let providerFiltered = $filter('getDomain')(provider);
    console.log("Providers:",providerFiltered);

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


myApp.service('streamin', function(nightmare ){
  const self = this;

  self.getFileUrl = function(url){
    console.log("Streamin", url);
    return nightmare.scrapeLinkFromProvider(url);
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

  this.searchByTmbdId = function(id = $routeParams.tvId){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}`);
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
    let storeName = type+"-"+page;
    if(cache.get(storeName)){
      deferred.resolve(cache.get(storeName));
    }else{
      return $http.get(`${url}/tv/${type}?${apiKey}&page=${page}`);
    }
    return deferred.promise;
  }

  this.movieFeed = function(type , page){
    console.log(`${url}/movie/${type}?${apiKey}&page=${page}`);
    return $http.get(`${url}/movie/${type}?${apiKey}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${url}/tv/${$routeParams.tvId}/external_ids`);
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

myApp.service('window', function() {
  const remote = require('electron').remote;
  const {BrowserWindow} = require('electron').remote;

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
