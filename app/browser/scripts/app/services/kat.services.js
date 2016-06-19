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
