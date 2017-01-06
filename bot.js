var database = require('./database');

var request = require('request-promise');

var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(user_input) {
  var docClient = database.init();

  var current_type = 'test';

  var table = "Milk";

  var date = Date.now();

  var options = {
    uri: 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&verbose=true&',
    qs: {
      q: 'pumped' // -> uri + '?q=xxxxx%20xxxxx'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  return request(options)
    .then(function (data) {

      console.log(data);
      var params = {
        TableName: table,
        Item:{
          "date": date,
          "type": current_type,
          "info":{
            "intent": data.topScoringIntent.intent,
            "entity": JSON.stringify(data.entities)
          }
        }
      };

      return docClient
        .put(params)
        .promise();
    })
    .then(function(data) {
      console.log('>>>> ADD DATA' + JSON.stringify(data));

      var params2 = {
        TableName: table,
        Key:{
          "date": date,
          "type": current_type
        }
      };

      return docClient
        .get(params2)
        .promise();
    })
    .then(function(data) {
      console.log('>>>> GET data' + JSON.stringify(data));
      return 'I made it here!';
    })
    .catch(function(err) {
      return 'Sorry something went wrong :(';
    });

});

module.exports = stashBot;
