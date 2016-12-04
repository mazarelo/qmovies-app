myApp.service('notifications', function(){
  const self = this;
  self.new = function(theBody,theIcon, theTitle , cb = "") {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle , options);
    // If the user clicks in the Notifications Center, show the app
    n.onclick = function () {
      options.title = theTitle;
      cb(options);
    }
    setTimeout(n.close.bind(n), 5000);
  }

});
