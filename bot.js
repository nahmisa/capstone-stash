var database = require('./database');
var docClient = database.init();

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(user_input) {

  var options = {
    uri: 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=pumped',
    // qs: {
    //   q: 'pumped' // -> uri + '?q=xxxxx%20xxxxx'
    // },
    // headers: {
    //   'User-Agent': 'Request-Promise'
    // },
    json: true // Automatically parses the JSON string in the response
  };

  var now = Date.now();
  var current_type = 'test';

  return fetch(options.uri)
    .then(function(result){
      return result.json();
    })
    .then(function (data) {

      var params = database.createPutParams(
          current_type,
          data.topScoringIntent.intent,
          data.entities,
          now);

      return docClient
        .put(params)
        .promise();
    })
    .then(function(data) {

      var params = database.createGetParams(current_type, now);

      return docClient
        .get(params)
        .promise();
    })
    .then(function(data) {
      return 'I made it here!';
    })
    .catch(function(err) {
      return 'Sorry something went wrong :(';
    });

});

module.exports = stashBot;
