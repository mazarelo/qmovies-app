myApp.directive("videoControllers", function() {
  return {
    replace: "true",
    template: `
    <div id="player" ng-controller="VideoController as video">
      <div id="video-controls">
        <figure ng-click="video.play()">
          <img src="assets/img/global/play-button.svg">
        </figure>
        <figure ng-click="video.pause()">
          <img src="assets/img/global/pause-button.svg">
        </figure>
        <figure ng-click="video.stop()">
          <img src="assets/img/global/stop-button.svg">
        </figure>
        <figure ng-click="video.fullScreen()">
          <img src="assets/img/global/fullscreen-button.svg">
        </figure>
      </div>
      <div id="video-placeholder">
      </div>
    </div>`
  }
 });
