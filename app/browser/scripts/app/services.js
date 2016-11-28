myApp.service('database', function($q , $routeParams){
  var PouchDB = require('pouchdb');
  var db = new PouchDB('mydb');

});

myApp.service('dates', function(){
  var today = new Date();

    this.compareDates = function(d){
      let currentDate = today;
      let targetDate = new Date(d);
      return currentDate.getTime() >= targetDate.getTime();
    }

    this.daysLeft = function(d){
      let releaseData = new Date(d);
      //Get 1 day in milliseconds
      let one_day=1000*60*60*24;
      // Convert both dates to milliseconds
      let date1_ms = today.getTime();
      let date2_ms = releaseData.getTime();
      // Calculate the difference in milliseconds
      let difference_ms = date2_ms - date1_ms;
      let daysLeft = Math.round(difference_ms/one_day);
      if(daysLeft<0){
        daysLeft = "Br";
      }
      return daysLeft;
    }
});

/* GET LIST OF SERIES */
//https://eztvapi.ml/shows/{page}

/* GET SERIE ID TORRENTS AND INFO */
//https://eztvapi.ml/show/{serieId}

myApp.service('eztvapi', function($http , $routeParams ){
  const self = this;
  const apiUrl = "https://eztvapi.ml";

  self.getTotalPages = function(){
    return $http.get(`${apiUrl}/shows`);
  }

  self.getFeed = function(page){
    //return $http.get("./json/eztv-feed.json")
    return $http.get(`${apiUrl}/shows/${page}`);
  };

  self.getSerieInfo = function(){
    console.log(`${apiUrl}/show/${$routeParams.tvId}`);
    return $http.get(`${apiUrl}/show/${$routeParams.tvId}`);
  }

  self.getSerieSeason = function(){

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

  self.readFolder = function(dir){
    console.log( fs.readdirSync(folder) );
    var folder = APP_FILES+"/"+dir;
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

myApp.service('imageChecker', function( $q,$routeParams ){

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

myApp.service('kat', function( $q , $routeParams , $filter ){
  const kickass = require('kickass-torrent');
/*
  function formatBytes(bytes,decimals) {
     if(bytes == 0) return '0 Byte';
     var k = 1000;
     var dm = decimals + 1 || 3;
     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
     var i = Math.floor(Math.log(bytes) / Math.log(k));
     return Math.round((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function checkResolution(name , bytes){
    if(name.includes("720")){
      return "720p";
    }else if(name.includes("1080")){
      return "1080p";
    }else if(name.includes("4k")){
      return "4k";
    }else{
      return $filter('formatBytes')(bytes);
    }
  }
*/

  this.query = function(query , season , episode){
      var deferred = $q.defer();
      season = (season < 10 ? '0'+season : season);
      episode = (episode< 10? '0'+episode : season);
      console.log(`Torrent Query Started : ${query} S${season}E${episode}`);

      kickass({
          q: `${query} S${season}E${episode}`,//actual search term
          field:'',//seeders, leechers, time_add, files_count, empty for best match
          order:'desc',//asc or desc
          page: 1,//page count, obviously
          url: 'https://kat.am',//changes site default url (https://kat.cr)
          },function(e, data){
              //will get the contents from
              //http://kickass.to/json.php?q=test&field=seeders&order=desc&page=2
              if(e){
                return console.log(data);
              }

              console.log("data from Kickass:");
              console.log(data);

              let final = [];
              final.push(data.list[0]);
              final.push(data.list[1]);
              final.push(data.list[2]);
              /*
              final[0].size = checkResolution(final[0].title , final[0].size);
              final[1].size = checkResolution(final[1].title , final[1].size);
              final[2].size = checkResolution(final[2].title , final[2].size);
              */
              final[0].size = $filter('checkResolution')(final[0].title , final[0].size);
              final[1].size = $filter('checkResolution')(final[1].title , final[1].size);
              final[2].size = $filter('checkResolution')(final[2].title , final[2].size);
              deferred.resolve(final);
          })
      return deferred.promise;
    }

});


myApp.service('mpft', function( $q , $routeParams ){

const FindTorrent = require('machinepack-findtorrent');

  this.query = function(title , season=1 , episode=1){
    var deferred = $q.defer();
    // Query EZTV Torrents.
    FindTorrent.queryAll({
      query: 'Walking dead S05E02'
      }).exec({
      // An unexpected error occurred.
      error: function (err){
       console.log('error', err);
      },
      // OK.
      success: function (data){
       deferred.resolve(data);
      },
    });
        return deferred.promise;
    };
   
});

'use strict';
/*
myApp.service('nightmare', function($http , $routeParams ){
  const self = this;
  var url = {
    "movie": "https://movies.com",
    "tv": "https://another.com"
  }
var Nightmare = require('nightmare'),
    nightmare = Nightmare();

    self.getTvSeriesLinks = function(){
      var deferred = $q.defer();
*/
var jquery = require('jquery'),
    Nightmare = require('nightmare'),
    nightmare = Nightmare();

var url = "https://craig.co.uk";

var city = process.argv[2];
nightmare.goto('http://watchepisodes.cc/american_horror_story_s1s11/')
.wait()
.evaluate(function(){
  /* links */
  var results = [];
  var elements = document.querySelectorAll(".table-info-links .btn-bordered");

  elements.forEach(function(item) {
    var single = {};
    single['title'] = item.textContent;
    single['link'] = item.href;
    results.push(single);
  });

  return results;
})
.end()
.then(function(result){
  console.log(result);
  for(var single in result){
    console.log(result[single].title);
    console.log(result[single].link);
    console.log("\n");
  }

  //deferred.resolve(result);
});
      /*
      return deferred.promise;
    }

    self.getMoviesLinks = function(){

    }

});
*/

myApp.service('notifications', function(){

  const self = this;

  self.new = function(theBody,theIcon,theTitle) {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle,options);
    setTimeout(n.close.bind(n), 5000); 
  }

});

myApp.service('qmovies', function($http , $routeParams ){
  this.getTvEpisodeLinks = function(title){
    var season = ($routeParams.season <10 ? "0"+$routeParams.season : $routeParams.season );
    var episode = ($routeParams.episode <10 ? "0"+$routeParams.episode : $routeParams.season );
    console.log(`http://qmovies.eu/app/functions/series/getEpisodeLinksScrapper.php?title=${title}&season=${season}&episode=${episode}`);
    return $http.get(`http://qmovies.eu/app/functions/series/getEpisodeLinksScrapper.php?title=${title}&season=${season}&episode=${episode}`);
  };
});


myApp.service('tmdb', function($http , folder , $routeParams){

  const  apiKey = "api_key=7842e553f27c281212263c594f9504cf";
  const  url = "https://api.themoviedb.org/3";
  const  personUrl = "https://api.themoviedb.org/3/person/";
  const  imgUrl = "http://image.tmdb.org/t/p/";

  this.fetchTmdb = function(platform = "tv", type , query , page){
    console.log(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
    return $http.get(`${url}/${type}?${query}&${apiKey}&${apiKey}&page=${page}`);
  }

  this.searchByTmbdId = function(id){
    console.log(`${url}/tv/${id}?${apiKey}`);
    return $http.get(`${url}/tv/${id}?${apiKey}`);

  }

  this.searchByImdbId = function(imdbId){
    console.log(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    return $http.get(`${url}/find/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
  }

  this.tvFeed = function(type , page){
    console.log(`${url}/tv/${type}?${apiKey}&page=${page}`);
    return $http.get(`${url}/tv/${type}?${apiKey}&page=${page}`);
  }

  this.getTvSerieExternalIds = function(){
    return $http.get(`${url}/tv/${$routeParams.tvId}/external_ids`);
  }

  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
    return $http.get(`${url}/tv/${$routeParams.tvId}?${apiKey}&language=en-US&external_source=imdb_id`);
  }

/*
  this.tvSerie = function(){
    console.log(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
    return $http.get(`${url}/tv/${$routeParams.tvId}?${apiKey}&append_to_response=external_ids`);
  }
*/
  this.tvSeason = function(id ,season = $routeParams.season){
    console.log(`${url}/tv/${id}/season/${$routeParams.season}?${apiKey}`);
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

myApp.service('torrentz', function(folder ,video , $q) {
//http://www.torrentz.eu/verified?f=dead+pool

});

myApp.service('video', function() {

  this.milisecondsToReadable = function(milliseconds){
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
      return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
      return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks?
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
      return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
  }

});

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

        /* torrent info */
        torrentDownloadSpeed.textContent = self.kbsToReadable( Math.floor( torrent.downloadSpeed) , true);
        torrentProgress.value = Math.floor( torrent.progress/100 );
        timeRemaining.textContent = video.milisecondsToReadable( torrent.timeRemaining/100 );
        /* end */

        if(Math.floor( torrent.progress*100) >= 2){
          if(once) return;
          once = true;

          final[0].appendTo("#video-placeholder",{ maxBlobLength: 2* 1000 * 1000 * 1000 }, function(err, elem) {
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
