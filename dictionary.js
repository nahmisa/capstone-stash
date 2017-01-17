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
  var showMilk = function(entities) {

    var constr = buildRequestConstraints(entities);

    console.log(constr);

    console.log(sumMilkByConstraints(constr));

    return sumMilkByConstraints(constr);

  };

  // freeze, thaw
  // freezeMilk & thawMilk take entities as parameter because other methods in the dictionary do and this make it more resuable.

  var freezeMilk = function(entities) {
    return updateMilk('Freeze', entities, { 'type': 'fresh' });
  };

  var thawMilk = function(entities) {
    return updateMilk('Thaw', entities, { 'type': 'frozen' });
  };

  var feedMilk = function(entities) {
    // when we feed milk, we feed from first to expire regardless of type.  Will normally be thawed then fresh then froze because of expirationd dates.
    return updateMilk('Use', entities, {});
  };

  var updateMilk = function(intent, entities, whereType) {

      var amount = getEntityByType(entities, 'Quantity');
      console.log('updating database');

    // .select('*').from
    return db('milk')
      .where(whereType)
      .andWhere('amount', amount)
      .orderBy('exp_date', 'asc')
      .limit(1)
      .update(database.createUpdateParams(intent));

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
      .where(constraints)
      .whereNot({type: 'consumed'})
      .reduce(function(a, b) {
      return a + b.amount;
      }, 0);

  };

  var dict = {
  };
  // setup Function as Value
  dict['Add'] = addMilk;
  dict['Display'] = showMilk;
  dict['Use'] = feedMilk;
  dict['Freeze'] = freezeMilk;
  dict['Thaw'] = thawMilk;
  dict['None'] = unknownAction;

  return dict;

};

module.exports = {
  init: init
};
