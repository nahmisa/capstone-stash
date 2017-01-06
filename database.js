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

var createUpdateParams = function(type, date, entities) {
  return {
    TableName:tableName,
    Key:{
      "date": date,
      "type": type
    },
    UpdateExpression: "set info.entity = :e",
    ExpressionAttributeValues:{
        ":e": JSON.stringify(entities)
    },
    ReturnValues:"UPDATED_NEW"
  };
};


// question about this in the docs...
var createQueryParams = function(type) {
  return {
    TableName : tableName,
    KeyConditionExpression: "#type = :type",
    ExpressionAttributeNames:{
        "#type": "type"
    },
    ExpressionAttributeValues: {
        ":type": 'test'
    }
  };
};

module.exports = {
  init: init,
  createPutParams: createPutParams,
  createGetParams: createGetParams,
  createUpdateParams: createUpdateParams
};
