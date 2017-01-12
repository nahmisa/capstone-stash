var init = function() {
  require('dotenv').config();
  var mySQL = require('mysql');

  return mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

};

var interpretType = function(intent) {
  switch (intent) {
  case 'Thaw':
    return 'thawed';
  case 'Use':
    return 'consumed';
  case 'Use':
    return 'consumed';
  case 'Add':
    return 'fresh';
  case 'Give':
    return 'away';
  case 'Freeze':
    return 'frozen';
  default:
    return 'milk';
  }
};

var computeExpDate = function(type, date) {
  require('datejs');
// https://www.cdc.gov/breastfeeding/recommendations/handling_breastmilk.htm
// assuming for now that fresh means in the refridgerator: 5 days
// frozen means freezer compartment with separate doors: 3-6 months
// thawed milk needs to be used in 24 hours - expiration date is today;

  switch (type) {
  case 'fresh':
    return Date.today().add({ days: 5 });
  case 'frozen':
    return Date.today().add({months: 6});
  case 'thawed':
    return Date.today();
  default:
    return Date.today();
  }
};


var createPutParams = function(amount, intent) {
  var type   = interpretType(intent);

  return {  amount: amount,
            type: type,
            location: 'home',
            exp_date: computeExpDate(type, Date.now())
          };
};


//
// var createGetParams = function(type, date) {
//   return {
//     TableName: tableName,
//     Key:{
//       "date": date,
//       "type": type
//     }
//   };
// };
//
// var createUpdateParams = function(type, date, entities) {
//   return {
//     TableName:tableName,
//     Key:{
//       "date": date,
//       "type": type
//     },
//     UpdateExpression: "set info.entity = :e",
//     ExpressionAttributeValues:{
//         ":e": JSON.stringify(entities)
//     },
//     ReturnValues:"UPDATED_NEW"
//   };
// };
//
//
// // question about this in the docs...
// var createQueryParams = function(type) {
//   return {
//     TableName : tableName,
//     KeyConditionExpression: "#type = :type",
//     ExpressionAttributeNames:{
//         "#type": "type"
//     },
//     ExpressionAttributeValues: {
//         ":type": 'test'
//     }
//   };
// };

module.exports = {
  init: init,
  createPutParams: createPutParams
  // createGetParams: createGetParams,
  // createUpdateParams: createUpdateParams
};
