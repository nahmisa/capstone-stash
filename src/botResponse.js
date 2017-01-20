var dictionary = require('./dictionary');
var methods = dictionary.init();

var calculateAmount = async function(action, result) {

  var milkTotals = {};

  milkTotals.total = result;
  milkTotals.frozen = await methods['Display']([{
      "entity": "frozen",
      "type": "Type"
      }]);
  milkTotals.thawed = await methods['Display']([{
      "entity": "thawed",
      "type": "Type"
      }]);
  milkTotals.consumed = await methods['Display']([{
      "entity": "consumed",
      "type": "Type"
      }]);

  return milkTotals;
  // based on the aciton, we will provide different output
  // switch (action) {
  // case 'Display':
  //   return result;
  // case 'Add':
  // // report all the milk ever when a mom adds milk
  //   return methods['Display']([]);
  // case 'Thaw':
  // case 'Freeze':
  //   // report the milk thawed/frozen and say how much milk is left frozen (should only have a little thawed at a time).
  //   return methods['Display']([{
  //     "entity": "frozen",
  //     "type": "Type"
  //     }]);
  // default:
  //   return methods['Display']([]);
  // }
};

// can use milk totals to give an overview of the state of the db
var createOutput = function(action, query, result) {
  // based on the aciton, we will provide different output
  console.log("This should be a dictionary of totals", result);
  switch (action) {
  case 'Display':
    console.log( 'You said: ' + query + " " + "There are " + result.total + " oz total.");
    return 'You said: ' + query + ". " +
      "There are " + result.total + " oz of milk total.";

  case 'Add':
  // report all the milk that has not been consumed when a mom adds milk
    console.log('You said: ' + query + " " + "After adding that milk, there are " + result.total + " oz of milk total.");
    return 'You said: ' + query + " " +
    "After adding that milk, there are " + result.total + " oz of milk total.";

  case 'Use':
    // report all that has not been consumed.
    console.log('You said: ' + query + " " +
      "After using that milk, there are " + result.consumed + " oz of milk total.");
    return 'You said: ' + query + " " +
      "After using that milk, there are " + result.consumed + " oz of milk total.";

  case 'Thaw':
  case 'Freeze':
    // report the milk thawed/frozen and say how much milk is left frozen (should only have a little thawed at a time).

    console.log('You said: ' + query + " " +
      "Now there are " + result.frozen + " oz of frozen milk.");
    return 'You said: ' + query + " " +
      "Now there are " + result.frozen + " oz of frozen milk.";

  default:
    return 'Great I got it! ' + result;
  }

};

module.exports = {
  calculateAmount: calculateAmount,
  createOutput: createOutput
};
