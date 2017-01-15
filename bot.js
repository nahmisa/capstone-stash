var dictionary = require('./dictionary');
var methods = dictionary.init();

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(user_input, originalApiRequest) {

  var now = Date.now();

  console.log(">>>> OG Request: ", originalApiRequest);

  var luisURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';

  return fetch(luisURL + user_input.text)
    .then(function(result){

      return result.json();

    })
    .then(function(data) {
      console.log("LUIS returned after " + (Date.now()-now) + " ms");
      console.log(data);
      var action = data.topScoringIntent.intent;

      if (action == "None") throw "I didn't understand what you said";

      var entities = data.entities;

      // console.log(amount);
      console.log(methods[action]);

      return methods[action](entities);

    })
    .then(function(result) {
      if(Array.isArray(result)) {
        // if the result is an array we have added an item to the database and now want to display the sum of all items in the database
        return methods['Display']([]);
      } else {
        // if the result is not an array, it is already the sum we wish to display.
        return result;
      }
    })
    .then(function(result) {
      console.log("MYSQL returned after " + (Date.now()-now) + " ms");

      console.log(user_input.text);
      console.log(result + ' oz');

      return "You said: " + user_input.text + ".  You've got " + result + ' oz.';
    })
    .catch(function(err) {

      console.log(err);

      return 'Sorry something went wrong :(. ' + err;
    });

});

module.exports = stashBot;
