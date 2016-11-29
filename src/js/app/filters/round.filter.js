myApp.filter('round', function() {
  return function(input){
    let number = parseInt(input);
    return Math.round(number);
  }
});
