var init = function() {
  require('dotenv').config();

  var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  });

  return knex;
};

var interpretType = function(intent) {
  switch (intent) {
  case 'Thaw':
    return 'thawed';
  case 'Use':
    return 'consumed';
  case 'Add':
    return 'fresh';
  case 'Give':
    return 'away';
  case 'Freeze':
    return 'frozen';
  default:
    return null;
  }
};

var computeExpDate = function(type) {
  require('datejs');
// https://www.cdc.gov/breastfeeding/recommendations/handling_breastmilk.htm
// assuming for now that fresh means in the refridgerator: 5 days
// frozen means freezer compartment with separate doors: 3-6 months
// thawed milk needs to be used in 24 hours - expiration date is today;

  switch (type) {
  case 'fresh':
    return Date.today().add({ days: 5 });
  case 'frozen':
    return Date.today().add({ months: 6 });
  case 'thawed':
    return Date.today();
  case 'consumed':
    // To ensure this date doesn't come up when querying to feed baby
    // Set at a date when we are sure baby will be weaned.
    return Date.today().add({ years: 100 });
  default:
    return Date.today();
  }
};

var createPutParams = function(amount, intent) {
  var type   = interpretType(intent);

  return {  amount: amount,
            milk_type: type,
            location: 'home',
            exp_date: computeExpDate(type),
            date: Date.now()
          };
};

var createUpdateParams = function(intent) {
  var type   = interpretType(intent);

  return {  milk_type: type,
            location: 'home',
            exp_date: computeExpDate(type),
            date: Date.now()
          };
};

module.exports = {
  init: init,
  createPutParams: createPutParams,
  createUpdateParams: createUpdateParams
};
