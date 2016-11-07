myApp.controller("VideoController" , function( $scope, webTorrent , yify , $routeParams ) {

  const self = this;

  self.checkStatus = function(){
    let video = document.getElementsByTagName("video");
    if(video.paused){
      self.checkStatus = false;
    }else{
      self.checkStatus = true;
    }
  };

  self.pause = function() {
      let video = document.getElementsByTagName("video");
      video[0].pause();
  }

  self.play = function(){
    let video = document.getElementsByTagName("video");
    if (video[0].paused) {
      video[0].play();
    } else {
      video[0].pause();
    }
  //  video[0].play();
  }

  self.stop = function(){
    let video = document.getElementsByTagName("video");
    video[0].currentTime = 0;
    video[0].pause();
  }

  self.fullScreen = function(){
    let video = document.getElementsByTagName("video");
    if(video[0].webkitEnterFullscreen){
			video[0].webkitEnterFullscreen();
		}
  }

});
