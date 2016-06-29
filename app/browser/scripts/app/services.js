myApp.service('database', function($q , $routeParams){
  //prefixes of implementation that we want to test
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    if (!window.indexedDB) {
       window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }

    const userData = [
       { id: "0", name: "Joao", age: 26, email: "jvmazarelo@gmail.com" }
    ];
    var db;
    var request = window.indexedDB.open("users", 1);

    request.onerror = function(event) {
       console.log("error: ");
    };

    request.onsuccess = function(event) {
       db = request.result;
       console.log("success: ");
       console.log(db.objectStoreNames);
    };

    request.onupgradeneeded = function(event) {
       var db = event.target.result;
       var objectStore = db.createObjectStore("employee", {keyPath: "id"});

       for (var i in userData) {
          objectStore.add(userData[i]);
       }
    }

  /* add database */
  this.add = function () {
     var request = db.transaction(["employee"], "readwrite")
     .objectStore("employee")
     .add({ id: "01", name: "prasad", age: 24, email: "prasad@tutorialspoint.com" });

     request.onsuccess = function(event) {
        alert("Prasad has been added to your database.");
     };

     request.onerror = function(event) {
        alert("Unable to add data\r\nPrasad is already exist in your database! ");
     }
  }
  /* read database */
  this.read = function() {
     var transaction = db.transaction(["employee"]);
     var objectStore = transaction.objectStore("employee");
     var request = objectStore.get("00-03");

     request.onerror = function(event) {
        alert("Unable to retrieve daa from database!");
     };

     request.onsuccess = function(event) {
        if(request.result) {
           alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
        }

        else {
           alert("Kenny couldn't be found in your database!");
        }
     }
   }
   /* read all database */
   this.readAll = function() {
       var objectStore = db.transaction("employee").objectStore("employee");

       objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
             alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
             cursor.continue();
          }

          else {
             alert("No more entries!");
          }
       };
    }
    /* remove */
    this.remove = function() {
       var request = db.transaction(["employee"], "readwrite")
       .objectStore("employee")
       .delete("02");

       request.onsuccess = function(event) {
          alert("prasad entry has been removed from your database.");
       };
    }

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
      console.log(date1_ms);
      console.log(date2_ms);
      // Calculate the difference in milliseconds
      let difference_ms = date2_ms - date1_ms;
      let daysLeft = Math.round(difference_ms/one_day);
      if(daysLeft <0){
        daysLeft = "Br";
      }
      return daysLeft; 
    }
});

myApp.service('eztv', function( $q , $routeParams ){

  this.query = function(title , season=1 , episode=1){
    var deferred = $q.defer();
    // search for game of thrones season 1 episode 2 with all scrapers
  //deferred.resolve(results);
      return deferred.promise;
    };
});

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
      return formatBytes(bytes)
    }

  }

  this.query = function(query , season , episode){
      var deferred = $q.defer();
      season = (season < 10 ? '0'+season : season);
      episode = (episode< 10? '0'+episode : season);

      kickass({
          q: `${query} S${season}E${episode}`,//actual search term
          field:'',//seeders, leechers, time_add, files_count, empty for best match
          order:'desc',//asc or desc
          page: 1,//page count, obviously
          url: 'https://kat.al',//changes site default url (https://kat.cr)
          },function(e, data){
              //will get the contents from
              //http://kickass.to/json.php?q=test&field=seeders&order=desc&page=2
              if(e){
                console.log(data);
              }

              var final = [];
              final.push(data.list[0]);
              final.push(data.list[1]);
              final.push(data.list[2]);

              final[0].size = checkResolution(final[0].title , final[0].size);
              final[1].size = checkResolution(final[1].title , final[1].size);
              final[2].size = checkResolution(final[2].title , final[2].size);

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
          timeRemaining.textContent = video.milisecondsToReadable(torrent.timeRemaining);

          if(Math.floor( torrent.progress*100) >=5){
            if(once){
              return
            }
            once = true;

            final[0].appendTo("#video-placeholder", function(err, elem) {
              console.log(err);
              document.getElementById("torrent-wrapper").classList.toggle("ng-hide");
            })

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
