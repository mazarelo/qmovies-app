myApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

myApp.filter('round', function() {
  return function(input){
    let number = parseInt(input);
    return Math.round(number);
  }
});

myApp.filter('romanize', function(){
  return function(num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
});

myApp.filter('formatBytes', function(){
  return function( bytes , decimals ){
    if(bytes == 0) return '0 Byte';
    var k = 1000;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
});

myApp.filter('checkResolution', function(){
  return function( name , bytes ){
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
});

myApp.filter('escape', function() {
  return window.encodeURIComponent;
});
