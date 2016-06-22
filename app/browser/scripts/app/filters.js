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

myApp.filter('escape', function() {
  return window.encodeURIComponent;
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
