var dictionary = require('./dictionary');
var methods = dictionary.init();

var calculateAmount = function(action, result) {
  // based on the aciton, we will provide different output
  switch (action) {
  case 'Display':
    return result;
  case 'Add':
  // report all the milk ever when a mom adds milk
    return methods['Display']([]);
  case 'Thaw':
  case 'Freeze':
    // report the milk thawed/frozen and say how much milk is left frozen (should only have a little thawed at a time).
    return methods['Display']([{
      "entity": "frozen",
      "type": "Type"
      }]);
  default:
    return methods['Display']([]);
  }
};

var createOutput = function(action, query, result) {
  // based on the aciton, we will provide different output
  switch (action) {
  case 'Display':
    console.log( 'You said: ' + query + " " + "There are " + result + " oz total.");
    return 'You said: ' + query + ". " +
      "There are " + result + " oz of milk total.";

  case 'Add':
  // report all the milk that has not been consumed when a mom adds milk
    console.log('You said: ' + query + " " + "After adding that milk, there are " + result + " oz of milk total.");
    return 'You said: ' + query + " " +
    "After adding that milk, there are " + result + " oz of milk total.";

  case 'Use':
    // report all that has not been consumed.
    console.log('You said: ' + query + " " +
      "After using that milk, there are " + result + " oz of milk total.");
    return 'You said: ' + query + " " +
      "After using that milk, there are " + result + " oz of milk total.";

  case 'Thaw':
  case 'Freeze':
    // report the milk thawed/frozen and say how much milk is left frozen (should only have a little thawed at a time).

    console.log('You said: ' + query + " " +
      "Now there are " + result + " oz of frozen milk.");
    return 'You said: ' + query + " " +
      "Now there are " + result + " oz of frozen milk.";

  default:
    return 'Great I got it! ' + result;
  }

};

module.exports = {
  calculateAmount: calculateAmount,
  createOutput: createOutput
};
