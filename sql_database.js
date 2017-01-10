var tableName = 'Milk';

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

var computeExpDate = function(type, date) {
  require('datejs');
// https://www.cdc.gov/breastfeeding/recommendations/handling_breastmilk.htm
// assuming for now that fresh means in the refridgerator: 5 days
// frozen means freezer compartment with separate doors: 3-6 months

  switch (type) {
  case 'fresh':
    return date.addDays(5);
  case 'frozen':
    return date.addMonths(6);
  default:
    return date;
  }
};


var createPutParams = function(amount, type, location, date) {

// defaults are that the woman is pumping fresh milk for home location now.

  return { table: tableName,
           params: {
            amount: amount,
            type: 'fresh',
            location: 'home',
            exp_date: computeExpDate(type, Date.now())
            }
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
  init: init
  // createPutParams: createPutParams
  // createGetParams: createGetParams,
  // createUpdateParams: createUpdateParams
};
