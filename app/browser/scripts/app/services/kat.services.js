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
