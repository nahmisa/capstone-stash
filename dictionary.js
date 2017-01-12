var database = require('./sql_database');
var connection = database.init();

var init = function() {

  // Add
  var putPromise = function(amount) {
    var intent = 'Add';
    var queryStart = Date.now();
    console.log('querying database');

    var result = connection.query('INSERT INTO `milk` SET ?', database.createPutParams(amount, intent), function(err, result) {
      console.log('in callback', err, result);

      //connection.end();
      //console.log('connection ended');

      if (err) throw err;

      console.log("amount=", amount, "id=", result.insertId);

      console.log('query took ' + (Date.now() - queryStart ));
    });




    return result;
  };

  // None
  var unknownAction = function() {
    throw "I didn't understand what you said";
  };

  var dict = {
  };
  // setup Function as Value
  dict['Add'] = putPromise;
  dict['None'] = unknownAction;

  return dict;

};

module.exports = {
  init: init
};
