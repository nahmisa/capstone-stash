var dictionary = require('./dictionary');
var methods = dictionary.init();

var fetch = require('node-fetch');

var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(user_input, originalApiRequest) {

  console.log(">>>> OG Request: ", originalApiRequest);

  var luisURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';


  var now = Date.now();
  var current_type = 'frozen';

  return fetch(luisURL + user_input.text, {timeout: 2000})
    .then(function(result){

      return result.json();

    })
    .then(function(data) {
      console.log("LUIS returned after " + (Date.now()-now) + " ms");
      console.log(data);
      var action = data.topScoringIntent.intent;
      if (action == "None") throw "I didn't understand what you said";
      var amount = data.entities[0].entity;

      console.log(amount);
      console.log(methods[action]);

      return methods[action](amount);

    })
    .then(function(data) {
console.log("MYSQL returned after " + (Date.now()-now) + " ms");
console.log('>>>this is the data ',data);
      return 'Great, I got it!' + JSON.stringify(data);
    })
    .catch(function(err) {

      console.log(err);

      return 'Sorry something went wrong :(. ' + err;
    });

});

module.exports = stashBot;
