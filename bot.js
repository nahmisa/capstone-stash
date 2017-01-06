var startRequireDatabase = Date.now();
var database = require('./database');
console.log("Require database took " + (Date.now() - startRequireDatabase) + " ms");
var startDocClientInit = Date.now();
var docClient = database.init();
console.log("Init doc client took " + (Date.now() - startDocClientInit) + " ms");

var startRequireFetch = Date.now();
var fetch = require('node-fetch');
console.log("Require fetch took " + (Date.now() - startRequireFetch) + " ms");

var startRequireBotBuilder = Date.now();
var botBuilder = require('claudia-bot-builder');
console.log("Require bot builder took " + (Date.now() - startRequireBotBuilder) + " ms");

var startBotBuilder = Date.now();
var stashBot = botBuilder(function(user_input) {
  console.log("Starting bot builder took " + (Date.now() - startBotBuilder) + " ms");




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
  console.log ("About to call LUIS");

  return fetch(options.uri)
    .then(function(result){
      return result.json();
    })
    .then(function (data) {

      console.log("LUIS returned", data);

      var params = database.createPutParams(
          current_type,
          data.topScoringIntent.intent,
          data.entities,
          now);

      console.log ("About to add to DB");

      return docClient
        .put(params)
        .promise();
    })
    .then(function(data) {
      console.log('Done adding to DB', data);

      var params = database.createGetParams(current_type, now);

      console.log ('About to get from DB');

      return docClient
        .get(params)
        .promise();
    })
    .then(function(data) {
      console.log('Done getting from DB', data);
      return 'I made it here!';
    })
    .catch(function(err) {
      return 'Sorry something went wrong :(';
    });

});

module.exports = stashBot;
