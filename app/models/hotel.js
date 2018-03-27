/**
 * Created by warrdnez on 31/07/16.
 */
var jQuery = require('jquery-deferred');
var constants = require('../utils/constants');

Hotel = function (dynamodb) {
    this.dynamodb = dynamodb;

    /**
     * Getting one hotel by
     * stars: string
     * name: String
     * */
    this.getHotelsByStars = function(docClient, id){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_HOTELS_TABLE,
            FilterExpression: "#id = :id",
            ExpressionAttributeNames:{
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":id": id
            }


        };

        docClient.scan(params, function(err, data) {
            if (err || data.Items.length === 0) {
                defer.reject();
            } else {
                defer.resolve(data.Items[0]);
            }
        });

        return defer.promise();
    };

    this.getHotels = function(docClient, muscles){
        var defer = new jQuery.Deferred();
        var muscles = JSON.parse(muscles);
        var filterExpression = "";
        var ExpressionAttributeValues = '{ ';

        for(var i = 0; i < muscles.length; i++){
            if(i < muscles.length - 1){
                filterExpression += "#musculo = :m" + i + " OR ";
                ExpressionAttributeValues += '":m' + i + '": "' + muscles[i] + '", ';
            }else{
                filterExpression += "#musculo = :m" + i;
                ExpressionAttributeValues += '":m' + i + '": "' + muscles[i] + '"';
            }
        }

        ExpressionAttributeValues += "}";
        var AttributeValues = JSON.parse(ExpressionAttributeValues);

        var params = {
            TableName : constants.DYN_HOTELS_TABLE,
            FilterExpression: filterExpression,
            ProjectionExpression: ["id","gif","respiracion","tips","imagen","nombre","descripcion","series","repeticiones","musculo","descanso","equipamiento"],
            ExpressionAttributeNames:{
                "#musculo": "musculo"
            },
            ExpressionAttributeValues: AttributeValues
        };



        docClient.scan(params, function(err, data) {
            if (err) {
                if(data && data.Items.length === 0){
                    defer.resolve([]);
                }else{
                    defer.reject();
                }
            } else {
                defer.resolve(data.Items);
            }
        });

        return defer.promise();
    };
};

module.exports = Hotel;
