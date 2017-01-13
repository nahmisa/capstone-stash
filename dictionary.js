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

  };

  // Display
  var showMilk = function() {

    return db
      .select().from('milk');

  };

  // None
  var unknownAction = function() {
    throw "I didn't understand what you said";
  };

  var getEntityByType = function(entities, type){
    // this handles the fact the LUIS.ai does not guarantee the order of entity within the entities array.  These come through based on the order they appear in the utterance, so we need to check against each's type until the correct type is found.
    // idk why just returning from the if statement didn't work here - gave me undefined.  Weird.
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

  var sumMilkByType = function(){

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
