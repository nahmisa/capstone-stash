var tableName = 'Milk';

var init = function() {
  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    // endpoint: "http://localhost:8000"
  });

  return new AWS.DynamoDB.DocumentClient();
};

var createPutParams = function(type, intent, entities, date) {
  return {
    TableName: tableName,
    Item:{
      "date": date,
      "type": type,
      "info":{
        "intent": intent,
        "entity": JSON.stringify(entities)
      }
    }
  };
};

var createGetParams = function(type, date) {
  return {
    TableName: tableName,
    Key:{
      "date": date,
      "type": type
    }
  };
};

module.exports = {
  init: init,
  createPutParams: createPutParams,
  createGetParams: createGetParams
};
