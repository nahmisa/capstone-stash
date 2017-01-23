// Requires
var database = require('./sql_database');
var db = database.init();

// Initializes a dictionary of methods
var init = function() {

  // Add intent
  var addMilk = function(entities) {
    var intent = 'Add';
    var amount = getEntityByType(entities, 'Quantity');

    return db('milks')
      .insert(database.createPutParams(amount, intent));
  };

  var getEntityByType = function(entities, type){
    // API does not guarantee the order of an entity within the entities array.
    // Need to check against each's type until the correct type is found.
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

  // Display intent
  var showMilk = function(entities) {
    var constraints = buildRequestConstraints(entities);

    return sumMilkByConstraints(constraints);
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

  var sumMilkByConstraints = function(constraints){
    // Constraints is an object of the not-null entities
    // The user has requested as constranints on the display.

    if(constraints.type == 'consumed') {
      // Omit the whereNot cosumed if we want the total of consumed
      return db
        .select('amount')
        .from('milks')
        .where(constraints)
        .reduce(function(a, b) {
        return a + b.amount;
        }, 0);
    }

    return db
      .select('amount')
      .from('milks')
      .where(constraints)
      .whereNot({milk_type: 'consumed'})
      .reduce(function(a, b) {
      return a + b.amount;
      }, 0);
  };

  // Methods the leverage Update
  var freezeMilk = function(entities) {
    return updateMilk('Freeze', entities, { 'milk_type': 'fresh' });
  };

  var thawMilk = function(entities) {
    return updateMilk('Thaw', entities, { 'milk_type': 'frozen' });
  };

  var feedMilk = function(entities) {
    // When we feed milk, we feed from first to expire regardless of type.
    // Will normally be thawed then fresh then frozen due to exp date
    return updateMilk('Use', entities, {});
  };

  var updateMilk = async function(intent, entities, whereType) {
    var updateIds = await getUpdateIds(entities, whereType);

    return db('milks')
      .whereIn('id', updateIds)
      .update(database.createUpdateParams(intent));
  };

  var getUpdateIds = async function(entities, whereType) {
    // Aggregate amounts of milk, starting with the soonest to expire
      // until the requested amount if fulfilled.
    // We return an array of ids. -->
      // The database receives all valid ids to update.
    // Amount can be fulfilled either through aggregation of multiple rows
      // OR through one row that equals the requested amount.
    // To ensure the bot uses milk on a FIFO basis, need to check both cases:
    // (1) starting with the aggregation case
    // Only moving to the exact amount match if:
      // (2) Amount is greater than 0 but we have run out of rows to check
        // (current checked row will be undefined)
      // OR
      // (3) the amount drops below 0
      var originalAmount = getEntityByType(entities, 'Quantity');
      var amount = getEntityByType(entities, 'Quantity');
      var ids = [];

      while(amount > 0) {
      // (1)
        var row = await getDbRow(amount, '<=', whereType, ids);
        if(row === undefined) {
        // (2)
          var singleRow = await getDbRow(originalAmount, '=', whereType, []);
          if(singleRow === undefined) throw "I am unable to do that with the milk we have.";

          return singleRow.id;
        }

        amount = amount - row.amount;
        if(amount >= 0){
          ids.push(row.id);
        } else {
        // (3)
          var singleRow = await getDbRow(originalAmount, '=', whereType, []);
          if(singleRow === undefined ) throw "I am unable to do that with the milk we have.";

          return singleRow.id;
        }
      }

    return ids;
  };

  var getDbRow = function(amount, amountComparison, whereType, ids) {

    return db('milks')
      .where(whereType)
      .where('amount', amountComparison, amount)
      .whereNot({ 'milk_type': 'consumed' })
      // at this point, we don't care about consumed milk
      .whereNotIn('id', ids)
      // Must not be in the ids that have already been added
      .orderBy('exp_date', 'asc')
      .first('id', 'amount');
  };

  // None
  var unknownAction = function() {
    throw "I didn't understand what you said";
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
