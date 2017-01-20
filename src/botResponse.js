var dictionary = require('./dictionary');
var methods = dictionary.init();

var calculateAmount = async function() {

  var milkTotals = {};

  milkTotals.total = await methods['Display']([]);

  milkTotals.fresh = await methods['Display']([{
      "entity": "fresh",
      "type": "Type"
      }]);

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

};

// can use milk totals to give an overview of the state of the db.
var createOutput = function(action, query, totals) {
  // based on the aciton, we will provide different output
  console.log("This should be a dictionary of totals", totals);
  switch (action) {
  case 'Display':
    console.log('You said: ' + query + ". " +
      "There are " + totals.total + " ounces of milk total, consisting of: ." +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces, ");

    return 'You said: ' + query + ". " +
      "There are " + totals.total + " ounces of milk total, consisting of: ." +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces.";

  case 'Add':
  // report all the milk that has not been consumed when a mom adds milk
    console.log('You said: ' + query + ". " +
      "After adding that milk, there are " + totals.total + " ounces of consumable milk total." +
      "Since you've been tracking, you've added " + (totals.consumed + totals.total) + " ounces - way to go!");

    return 'You said: ' + query + ". " +
      "After adding that milk, there are " + totals.total + " ounces of consumable milk total." +
      "Since you've been tracking, you've added " + (totals.consumed + totals.total) + " ounces - way to go!";


  case 'Use':
    // report all that has not been consumed.
    console.log('You said: ' + query + " " +
      "After using that milk, there are " + totals.total + " ounces of consumable milk left, consisting of: " +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces. " +
      "Since you've been tracking, Baby has consumed " + totals.consumed + " ounces - woah!");

    return 'You said: ' + query + " " +
      "After using that milk, there are " + totals.total + " ounces of consumable milk left, consisting of: " +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces. " +
      "Since you've been tracking, Baby has consumed " + totals.consumed + " ounces - woah!";

  case 'Thaw':

    console.log('You said: ' + query + " " +
      "After thawing that milk there are " + totals.thawed + " ounces of thawed milk.  Remeber, this milk expires in 24 hours so use it up! There are still " +
      totals.frozen + " frozen ounces.");

    return 'You said: ' + query + " " +
      "After thawing that milk there are " + totals.thawed + " ounces of thawed milk.  Remeber, this milk expires in 24 hours so use it up! There are still " +
      totals.frozen + " frozen ounces.";

  case 'Freeze':

    console.log('You said: ' + query + " " +
      "After freezing that milk there are " + totals.frozen + " ounces of thawed milk. There are still " +
      totals.fresh + " fresh ounces.");

    return 'You said: ' + query + " " +
      "After freezing that milk there are " + totals.frozen + " ounces of thawed milk. There are still " +
      totals.fresh + " fresh ounces.";

  default:
    return 'Great I got it! ' + totals.total;
  }

};

module.exports = {
  calculateAmount: calculateAmount,
  createOutput: createOutput
};
