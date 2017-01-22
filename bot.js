// Requires
require("babel-polyfill");

// require: (1) start file with all requires first
// require: (2) `var` --> `const`

var dictionary = require('./bin/dictionary');

// (1) `var` --> `const` (2) move to after `require`s
var methods = dictionary.init();

var response = require('./bin/botResponse');

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

// Bot Module
var stashBot = botBuilder(function(user_input, originalApiRequest) {

  // `const`
  var now = Date.now();

  // `let`
  var action = "";

  // Uses LUIS.ai for NLP
  // (1) `var` --> `const`  (2) why define within the function?   (3) subscription key in the code??
  var nlpURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';

  return fetch(nlpURL + user_input.text)
    // can refactor to:  `.then(result.json)`
    .then(function(result){
    // extract JSON of user intent and entities from LUIS api
      return result.json();
    })
    .then(function(data) {
    // Get the intent from the API data and use to determine the action/method
      action = data.topScoringIntent.intent;
      // Error-handle the case that the user's intent is not understood
    // extra space: " I didn't..."
      if (action == "None") throw " I didn't undersand what you said";

      return methods[action](data.entities);
    })
  // can refactor to: `.then(response.calculateAmount)`
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
    // funky indentation everywhere (keep comments exactly above relevant code)
      return 'Sorry something went wrong :(. ' + err;
    });
});

// how do you handle timeouts? or if a dependency is down? `err` is dev friendly (a sarcastic way of saying not user friendly)
// timeouts: if you timeout (given Slack, you know you have <3sec), you can fallback to delayed response.

module.exports = stashBot;
