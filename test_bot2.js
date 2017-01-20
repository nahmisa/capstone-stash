require("babel-polyfill");

var dictionary = require('./bin/dictionary');
var methods = dictionary.init();

var response = require('./bin/botResponse');

var fetch = require('node-fetch');


  var luisURL = 'https://api.projectoxford.ai/luis/v2.0/apps/c2c0c678-0ed6-41de-8abc-436a367927a9?subscription-key=18c637e3c39947c789395c46453683e7&q=';


  var now = Date.now();
  var current_type = 'test';

  var user_input = {text: "I pumped 2 oz."};

  // define a variable for action out here so we can use it through the entire bot...
  var action = "";
  var ids = [];

  return fetch(luisURL + user_input.text)
    .then(function(result){
      // console.log(result.json());
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

        if (result === 0) throw "You said: " + user_input.text + ", but I don't have enough milk to do that.";

      return response.calculateAmount(action, result);

    })
    .then(function(result) {

      console.log('log 1 >>>');
      return response.createOutput(action, user_input.text, result);

    })
    .catch(function(err) {
      console.log(err);
      return 'Sorry something went wrong :(. ' + err;
    });
