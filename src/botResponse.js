var dictionary = require('./dictionary');
var methods = dictionary.init(); // I think I already saw `dictionary.init()` in another file. Is this on purpose?

var calculateAmount = async function() {
  var milkTotals = {};
  // Available total (does not include consumed)
  milkTotals.total = await methods['Display']([]);
  // Fresh
  milkTotals.fresh = await methods['Display']([{
    // I understand this is a filtering object ("select milk where `Type` is `fresh`"). To use common naming patterns you can rename `entity` to `value`.
      "entity": "fresh",
      "type": "Type"
      }]);
  // Frozen
  milkTotals.frozen = await methods['Display']([{
      "entity": "frozen",
      "type": "Type"
      }]);
  // Thawed
  milkTotals.thawed = await methods['Display']([{
      "entity": "thawed",
      "type": "Type"
      }]);
  // Consumed
  milkTotals.consumed = await methods['Display']([{
      "entity": "consumed",
      "type": "Type"
      }]);

  // perf: you are `await`ing on every method to calculate. Why don't you send them all out and `await` on all of them finish, in any order?
  // codewise, I mean `await Promise.all([method1, method2, method3])` where a method is exacly what you have right now,
  // `milkTotal.fresh`, `milkTotals.frozen`, ... minus the `await`.
  
  return milkTotals;
};

var createOutput = function(action, query, totals) {
  // Based on the action, provide different output
  switch (action) {
  case 'Display':
      // As a user, why do I need to know what I said? Assuming this is for debugging purposes, maybe you can only 
      // reply with the user query if a secret word exists, e.g. "debug"?
    return "You said: " + "'" + query + "'. " +
      " There are " + totals.total + " ounces of milk total, consisting of: " +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces.";
  case 'Add':
  // Report all the milk - including the consumed milk
    return "You said: " + "'" + query + "'. " +
      " After adding that milk, there are " + totals.total + " ounces of consumable milk total. " +
      " Since you've been tracking, you've added " + (totals.consumed + totals.total) + " ounces - way to go!";
  case 'Use':
    // Report all that has not been consumed.
    // Give detail of baby's consumption later
    return "You said: " + "'" + query + "'. " +
      " After using that milk, there are " + totals.total + " ounces of consumable milk left, consisting of: " +
      totals.fresh + " fresh ounces, " +
      totals.frozen + " frozen ounces, and " +
      totals.thawed + " thawed ounces. " +
      " Since you've been tracking, Baby has consumed " + totals.consumed + " ounces - woah!";
  case 'Thaw':
    // Report thawed and still frozen
    return "You said: " + "'" + query + "'. " +
      " After thawing that milk there are " + totals.thawed + " ounces of thawed milk.  Remeber, this milk expires in 24 hours so use it up! There are still " +
      totals.frozen + " frozen ounces.";

  case 'Freeze':
    // Report frozen and still fresh
    return "You said: " + "'" + query + "'. " +
      " After freezing that milk there are " + totals.frozen + " ounces of frozen milk.  There are still " +
      totals.fresh + " fresh ounces.";
  default:
    return ' Great I got it! ' + totals.total;
  }
};

module.exports = {
  calculateAmount: calculateAmount,
  createOutput: createOutput
};
