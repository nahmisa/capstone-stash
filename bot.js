// Requires
require("babel-polyfill");

var dictionary = require('./bin/dictionary');
var methods = dictionary.init();

var response = require('./bin/botResponse');

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

// Bot Module
var stashBot = botBuilder(function(user_input, originalApiRequest) {

  var now = Date.now();

  var action = "";

  // Uses LUIS.ai for NLP
  var nlpURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';

  return fetch(nlpURL + user_input.text)
    .then(function(result){
    // extract JSON of user intent and entities from LUIS api
      return result.json();
    })
    .then(function(data) {
    // Get the intent from the API data and use to determine the action/method
      action = data.topScoringIntent.intent;
      // Error-handle the case that the user's intent is not understood
      if (action == "None") throw "I didn't undersand what you said";

      return methods[action](data.entities);
    })
    .then(function(data) {
    // Calculate total amounts of milk (after action) to use in response
      return response.calculateAmount();
    })
    .then(function(totals) {
    // Display appropriate reponse to user based on their inital action-intent
      return response.createOutput(action, user_input.text, totals);
    })
    .catch(function(err) {
    // Appologize for any errors and give user-friendly details
      return 'Sorry something went wrong :(. ' + err;
    });
});

module.exports = stashBot;
