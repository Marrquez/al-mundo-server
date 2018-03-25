var AWS = require('aws-sdk');
var constants = require('../utils/constants');
AWS.config.update({accessKeyId: constants.AK, secretAccessKey: constants.SAK});
//AWS.config.region = "us-west-2";
AWS.config.region = "us-east-2";

var dynamoUsers = require('../models/users.js');
var dynamoCatalogs = require('../models/catalogs.js');
var dynamoEjercicios = require('../models/ejercicios.js');

function AwsWrapper () {
    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();
    this.DynamoUsers = new dynamoUsers(this.dynamodb);
    this.DynamoCatalogs = new dynamoCatalogs(this.dynamodb);
    this.DynamoEjercicios = new dynamoEjercicios(this.dynamodb);
};

module.exports = AwsWrapper;