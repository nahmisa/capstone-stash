var dictionary = require('./dictionary');
var methods = dictionary.init();

var response = require('./botResponse');

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(user_input, originalApiRequest) {

  var now = Date.now();

  // define a variable for action out here so we can use it through the entire bot...
  var action = "";
  console.log(">>>> OG Request: ", originalApiRequest);

  var luisURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';

  return fetch(luisURL + user_input.text)
    .then(function(result){

      return result.json();

    })
    .then(function(data) {
      console.log(data);
      action = data.topScoringIntent.intent;

      if (action == "None") throw "I didn't undersand what you said";
      console.log(action);

      return methods[action](data.entities);
    })
    .then(function(result) {

      console.log(result, "<<<< The result");
      return response.calculateAmount(action);

    })
    .then(function(result) {
      console.log('log 1 >>>');
      return response.createOutput(action, user_input.text, result);
    })
    .catch(function(err) {
      console.log(err);
      return 'Sorry something went wrong :(. ' + errorMessage;
    });


});

module.exports = stashBot;
