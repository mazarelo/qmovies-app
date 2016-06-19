myApp.service('infinitLoader', function(){

return function(scope, element, attrs) {

  console.log("function started");
  var pageNumber = 1;
  const content = document.getElementById("feed-ajax");
  var windowHeight = window.innerHeight;
  const platform = "movies";
  var requestRunning = false;
  var currentUrl = window.location.href;
  var url;
  const checkView = document.getElementById("checkView");
  const loadMore = document.getElementById("load-more");

   angular.element("body").bind("scroll", function() {
     console.log("element scrool started");

    topPos = checkView.offsetTop;
    if(elementExists){
      if(topPos <= windowHeight){
        if(requestRunning) return;
        requestRunning = true;
        loadMore.style.visibility = "visible";
        url = currentUrl+pageNumber;
        $http.get(url).then(function(response){
          console.log("ajax");
          if(response.data.data.movies == ""){
            console.log("nothing to load");
            data = "<h1 class='infinitLoader-end'>You reached the End...</h1>";
            content.innerHTML += data;
            loadMore.style.visibility = "hidden";
            requestRunning = true;
          }else{
            for( var index in response.data.data.movies){
                scope.moviesData += response.data.data.movies[index];
            }
            loadMore.style.visibility = "hidden";
            requestRunning = false;
          }
        });
      }
    }
    scope.$apply();
  });
}



});
