/* login */
myApp.controller("SettingsController" , function( $scope , $routeParams , ipc ) {
  const self = this;
  self.title = "Settings";
  self.downloadPath = process.env.DOWNLOAD_PATH;

  self.closeModal = function(){
    document.getElementById("modal-12").classList.remove("md-show");
  }

  self.changeLocalPath = function(){
    self.downloadPath = ipc.openFoldersDialog()[0];
    console.log(self.downloadPath);
  }
});
