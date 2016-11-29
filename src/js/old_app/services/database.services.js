myApp.service('database', function($q , $routeParams){
  var PouchDB = require('pouchdb');
  var db = new PouchDB('mydb');

});
