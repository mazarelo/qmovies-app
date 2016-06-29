myApp.service('dates', function(){
  var today = new Date();

    this.compareDates = function(d){
      let currentDate = today;
      let targetDate = new Date(d);
      return currentDate.getTime() >= targetDate.getTime();
    }

    this.daysLeft = function(d){
      let releaseData = new Date(d);
      //Get 1 day in milliseconds
      let one_day=1000*60*60*24;
      // Convert both dates to milliseconds
      let date1_ms = today.getTime();
      let date2_ms = releaseData.getTime();
      console.log(date1_ms);
      console.log(date2_ms);
      // Calculate the difference in milliseconds
      let difference_ms = date2_ms - date1_ms;
      let daysLeft = Math.round(difference_ms/one_day);
      if(daysLeft <0){
        daysLeft = "Br";
      }
      return daysLeft; 
    }
});
