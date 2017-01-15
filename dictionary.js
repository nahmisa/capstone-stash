var database = require('./sql_database');
var db = database.init();

var init = function() {

  // Add
  var addMilk = function(entities) {

    var intent = 'Add';
    var amount = getEntityByType(entities, 'Quantity');

      var queryStart = Date.now();
      console.log('querying database');

    return db('milk')
      .insert(database.createPutParams(amount, intent));

    // return an affirmative message and how much milk they have
    // return showMilk([]);
  };

  // Display
  var showMilk = function(entities) {

    var constr = buildRequestConstraints(entities);

    console.log(constr);

    console.log(sumMilkByConstraints(constr));

    return sumMilkByConstraints(constr);

    // return ">>> Amount " + JSON.stringify(constr) + " " + sum;

  };

  var buildRequestConstraints = function(entities) {

    var initConstr = {};

    var dbType = getEntityByType(entities, 'Type');
    var dbLocation = getEntityByType(entities, 'Destination');

    //DB type
    if (dbType !== null) {
      initConstr.type = dbType;
    }
    //DB location
    if (dbLocation !== null) {
      initConstr.location = dbLocation;
    }

    return initConstr;
  };

  // None
  var unknownAction = function() {
    throw "I didn't understand what you said";
  };

  var getEntityByType = function(entities, type){
    // this handles the fact the LUIS.ai does not guarantee the order of entity within the entities array.  These come through based on the order they appear in the utterance, so we need to check against each's type until the correct type is found.

    var result = null;

    entities.forEach(function(entity){

      if (entity.type == type) {
        console.log(entity);
        console.log(entity.entity);
        result = entity.entity;
      }

    });

    return result;

  };

  var sumMilkByConstraints = function(constraints){
    // constrains is an object of the not-null entities that the user has requested as constranints on the display.
    console.log('Get milk by constraints');
    console.log(constraints);
     return db
      .select('amount')
      .from('milk')
      // type
      .where(constraints)
      .reduce(function(a, b) {
      return a + b.amount;
      }, 0);

  };

  var dict = {
  };
  // setup Function as Value
  dict['Add'] = addMilk;
  dict['Display'] = showMilk;
  dict['None'] = unknownAction;

  return dict;

};

module.exports = {
  init: init
};
