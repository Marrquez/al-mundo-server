var AWS = require('aws-sdk');
var constants = require('../utils/constants');
AWS.config.update({accessKeyId: constants.AK, secretAccessKey: constants.SAK});
//AWS.config.region = "us-west-2";
AWS.config.region = "us-east-2";

var dynamoHotels = require('../models/ejercicios.js');

function AwsWrapper () {
    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.DynamoHotels = new dynamoHotels(this.dynamodb);
};

module.exports = AwsWrapper;