var database = require('./sql_database');
var connection = database.init();

var init = function() {

  // Add
  var putPromise = function(type, data, now) {
    connection.connect();

    var result = connection.query('INSERT INTO milk SET ?', {location: 'home', amount: 2, exp_date: Date.now(), type: type}, function(err, result) {
      if (err) throw err;


      console.log(result.insertId);
    });


    connection.end();

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
