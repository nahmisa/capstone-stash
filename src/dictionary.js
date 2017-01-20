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
    // when we feed milk, we feed from first to expire regardless of type.  Will normally be thawed then fresh then frozen because of expirationd dates.
    return updateMilk('Use', entities, {});
  };

  var updateMilk = async function(intent, entities, whereType) {
    var updateIds = await getUpdateIds(intent, entities, whereType);

    console.log("updating databse", updateIds);

    // .select('*').from
   return db('milk')
    .whereIn('id', updateIds)
    .update(database.createUpdateParams(intent));
  };

  var getUpdateIds = async function(intent, entities, whereType) {

      var originalAmount = getEntityByType(entities, 'Quantity');

      var amount = getEntityByType(entities, 'Quantity');
      console.log('in function updateMilk');

      var ids = [];

      while(amount > 0) {
        var row = await getDbRow(amount, '<=', whereType, ids);

        console.log("Hopefully I return the row!", row)

        if(row === undefined ) {
          var singleRow = await getDbRow(originalAmount, '=', whereType, []);

          if(singleRow === undefined ) throw "I am unable to do that with the milk we have.";
          console.log('returning single row 1', singleRow);

          return singleRow.id;
        }

        amount = amount - row.amount;

        if(amount >= 0){

          ids.push(row.id);

        } else {
          var singleRow = await getDbRow(originalAmount, '=', whereType, []);

          if(singleRow === undefined ) throw "I am unable to do that with the milk we have.";
          console.log('returning single row', singleRow);
          return singleRow.id;
        }
      }

    return ids;
  };


  var getDbRow = function(amount, amountComparison, whereType, ids) {

    return db('milk')
      .where(whereType)
      .where('amount', amountComparison, amount)
      // at this point, we don't care about consumed milk
      .whereNot({ 'type': 'consumed' })
      // not in the ids that have already been added to the array
      .whereNotIn('id', ids)
      .orderBy('exp_date', 'asc')
      .first('id', 'amount');

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
