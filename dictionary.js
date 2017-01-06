var database = require('./database');
var docClient = database.init();

var init = function() {

  // add
  var putPromise = function(type, data, now) {

    var params = database.createPutParams(
        type,
        data.topScoringIntent.intent,
        data.entities,
        now);

    return docClient
      .put(params)
      .promise();
  };

  // thaw, use, give, freeze -- note, will need to do something for throw away
  var updatePromise = function(params) {
    return docClient
      .update(params)
      .promise();
  };

  // display?
  var getPromise = function(type, date) {
    var params = database.createGetParams(type, date);

    return docClient
      .get(params)
      .promise();
  };

  // displayAll
  var getAllPromise = function(params) {

    return docClient
      .query(params)
      .promise();
  };

  // None

  var unknownAction = function() {
    throw "I didn't understand what you said";
  };

  var dict = {
  };
  // setup Function as Value
  dict['Add'] = putPromise;
  dict['Thaw'] = updatePromise;
  dict['Use'] = updatePromise;
  dict['Give'] = updatePromise;
  dict['Freeze'] = updatePromise;
  dict['Display'] = getPromise;
  dict['DisplayAll'] = getAllPromise;
  dict['None'] = unknownAction;

  return dict;

};

module.exports = {
  init: init
};
