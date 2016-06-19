
myApp.directive("favoriteIcon", function() {
    return {
        template : `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="510px" height="510px" viewBox="0 0 510 510" enable-background="new 0 0 510 510" xml:space="preserve">
                      <path id="heart-fill"  d="M255,489.6l-35.7-35.7C86.7,336.6,0,257.55,0,160.65C0,81.6,61.2,20.4,140.25,20.4
                        c43.35,0,86.7,20.4,114.75,53.55C283.05,40.8,326.4,20.4,369.75,20.4C448.8,20.4,510,81.6,510,160.65
                        c0,96.9-86.7,175.95-219.3,293.25L255,489.6z"/></svg>
        `
    };
});

myApp.directive("playButton", function() {
    return {
        template : `
        <button class="le-action">
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="600px" height="600px" viewBox="0 0 600 600" enable-background="new 0 0 600 600" xml:space="preserve">
            <circle fill="#CF6F55" cx="300" cy="300" r="243.811"/>
            <polygon fill="#FFFFFF" points="431.888,300 225.875,424.379 225.875,175.62 431.888,300 	"/>
          </svg>
        </button>
        `
    };
});

myApp.directive("infinitLoader", function() {
    return {
        template : `
        <div id="checkView" scroll class="load-more-wrapper">
          <figure id="load-more">
            <img src="assets/img/loading.svg">
          </figure>
        </div>
        `
    };
});
myApp.directive("filtersTvFeed", function() {
    return {
        template : `
          <input type="text" id="input-search" class="m-typeahead" placeholder="Search for a movie or series here" ng-model="tvFeed.query" ng-change="tvFeed.search()" />
          <select ng-model="tvFeed.sortBy.value" ng-change="tvFeed.discover()">
            <option ng-repeat="sort in tvFeed.sortBy.options" value="{{sort.value}}">{{sort.name}}</option>
          </select>
          <select ng-model="tvFeed.genre.value" ng-change="tvFeed.discover()">
            <option value="" ng-selected="selected">any genre</option>
            <option ng-repeat="genre in tvFeed.genre.options" value="{{genre.value}}">{{genre.name}}</option>
          </select>
          <select ng-model="tvFeed.years.value" ng-change="tvFeed.discover()">
            <option value="" ng-selected="selected">all years</option>
            <option ng-repeat="year in tvFeed.years.options() | reverse" value="{{year}}">{{year}}</option>
          </select>
          <input type="number" ng-model="tvFeed.page" ng-change="tvFeed.discover()">
        `
    };
});
myApp.directive("filtersMovieFeed", function() {
    return {
        template : `
          <input type="text" id="input-search" class="m-typeahead" placeholder="Search for a movie or series here" ng-model="movieFeed.query" ng-change="movieFeed.moviesData()" />
          <select ng-model="movieFeed.sortBy.value" ng-change="movieFeed.moviesData()">
            <option ng-repeat="option in movieFeed.sortBy.options" value="{{option.value}}">{{option.name}}</option>
          </select>
          <select ng-model="movieFeed.genre.value" ng-change="movieFeed.moviesData()">
            <option ng-repeat="genre in movieFeed.genre.options" value="{{genre.value}}">{{genre.name}}</option>
          </select>
        `
    };
});
