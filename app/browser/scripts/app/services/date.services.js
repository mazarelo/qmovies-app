myApp.service('dates', function(){
    this.compareDates = function(d){
      let currentDate = new Date();
      let targetDate = new Date(d);
      return currentDate.getTime() >= targetDate.getTime();
    }
});
