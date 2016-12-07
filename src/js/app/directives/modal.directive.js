myApp.directive('settingsModal', function(){
  return {
    restrict: 'E',
    controller :  "SettingsController",
    controllerAs: "settings",
    templateUrl: "views/modals/settings.html"
  };
});
