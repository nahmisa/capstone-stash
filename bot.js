var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    // endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var botBuilder = require('claudia-bot-builder');

var stashBot = botBuilder(function(request) {


  var current_type = request.text;

  var table = "Milk";

  var date = Date.now();

  var params = {
      TableName: table,
      Item:{
          "date": date,
          "type": current_type,
          "info":{
              "something": "Foo",
              "something2": 0
          }
      }
  };

  // // for get
  var params2 = {
      TableName: table,
      Key:{
          "date": date,
          "type": current_type
      }
  };

  var addPromise = docClient.put(params).promise();

  addPromise.then(function(data) {
    // return "Added item:" + JSON.stringify(data, null, 2);
  }).catch(function(err) {
    // return "Unable to add item. Error JSON:" + JSON.stringify(err, null, 2);
  });


  var getPromise = docClient.get(params2).promise();

  getPromise.then(function(data) {
    // return 'Thanks for sending ' + type  +
    //     '.  Returns >>> ' + data;
  }).catch(function(err) {
    // return 'Thanks for sending ' + type  +
    //     '.  Something went wrong';
  });

  var response = Promise.all([addPromise, getPromise]).then(function(values) {
    console.log(values);
    return JSON.stringify(values[1].Item) + " >>>> " + request.text;

  });

  return response;

});


module.exports = stashBot;
