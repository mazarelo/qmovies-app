myApp.service('notifications', function(){

  const self = this;

  self.new = function(theBody,theIcon,theTitle) {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle,options);
    setTimeout(n.close.bind(n), 5000); 
  }

});