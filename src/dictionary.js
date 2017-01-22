// Requires
var database = require('./sql_database');
var db = database.init();

// Initializes a dictionary of methods
// I saw `.init` run from more than one place. On purpose? Doesn't seems so. 
// If it is, should there be an "if already run once don't run twice" check?
// Alternatively, a more testable pattern would be either using a `create()` 
// method (naming), or better a class with a constructor.
var init = function() {

  // Add intent
  var addMilk = function(entities) {
    // `const` and `let` instead of `var` everywhere, please.
    var intent = 'Add';
    var amount = getEntityByType(entities, 'Quantity');

    return db('milk')
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
    // naming: this is not `dbType`. More like `milkType`.
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
        .from('milk')
        .where(constraints)
        .reduce(function(a, b) {
        return a + b.amount;
        }, 0);
    }

    return db
      .select('amount')
      .from('milk')
      .where(constraints)
      .whereNot({type: 'consumed'})
    //  nice use of functional programming in general and `reduce` specifically.
    // tiny refactoring: you could create a method called `sum(a, b) { return a + b.amount; }` and then just call `reduce(sum)`
      .reduce(function(a, b) {   
      return a + b.amount;
      }, 0);
  };

  // Methods the leverage Update
  var freezeMilk = function(entities) {
    return updateMilk('Freeze', entities, { 'type': 'fresh' });
  };

  var thawMilk = function(entities) {
    return updateMilk('Thaw', entities, { 'type': 'frozen' });
  };

  var feedMilk = function(entities) {
    // When we feed milk, we feed from first to expire regardless of type.
    // Will normally be thawed then fresh then frozen due to exp date
    return updateMilk('Use', entities, {});
  };

  var updateMilk = async function(intent, entities, whereType) {
    var updateIds = await getUpdateIds(entities, whereType);

    return db('milk')
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

    return db('milk')
      .where(whereType)
      .where('amount', amountComparison, amount)
      .whereNot({ 'type': 'consumed' })
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

  // odd syntax. why not:
  // ```
  // const dict = {
  //     add: addMilk,
  //     display: showMilk
  //     ...
  // };
  // ```
  // Also note the camel casing, as customery in JavaScript
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
