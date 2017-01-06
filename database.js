var init = function() {
  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    // endpoint: "http://localhost:8000"
  });

  return new AWS.DynamoDB.DocumentClient();
};

module.exports = {
  init: init
};
