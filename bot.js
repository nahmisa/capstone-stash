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
    // extract JSON of user intent and entities from LUIS api
    .then(function(result){

      return result.json();
    })
    // Get the intent from the API data and use to determine the action/method
    .then(function(data) {

      action = data.topScoringIntent.intent;

      if (action == "None") throw "I didn't undersand what you said";

      return methods[action](data.entities);
    })
    // Calculate total amounts of milk (after action) to use in response
    .then(function(data) {

      return response.calculateAmount();
    })
    // Display appropriate reponse to user based on their inital action-intent
    .then(function(totals) {

      return response.createOutput(action, user_input.text, totals);
    })
    // Appologize for any errors and give user-friendly details
    .catch(function(err) {

      return 'Sorry something went wrong :(. ' + err;
    });

});

module.exports = stashBot;
