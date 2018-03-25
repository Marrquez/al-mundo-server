/**
 * Created by warrdnez on 31/07/16.
 */
var jQuery = require('jquery-deferred');
var constants = require('../utils/constants');

Catalogs = function (dynamodb) {
    this.dynamodb = dynamodb;

    /**
     * Getting all user's catalogs by the user's area
     * pu: String, s: area
     * */
    this.getCatalogs = function(docClient){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_CATALOG_TABLE,
            FilterExpression: "#type = :type",
            ExpressionAttributeNames:{
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":type": 1
            }
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

    /**
     * Getting all user's catalogs
     * pu: String, type: number
     * */
    this.getCatalogsOfUserByArea = function(docClient, user_id, ct, a){
        var defer = new jQuery.Deferred();

        var filterExpression = "#type = :type and (";
        var ExpressionAttributeValues = '{":type": ' + ct + ', ';
        var areas = JSON.parse(a);

        if(areas.length === 0){
            filterExpression += "#a = :a";
            ExpressionAttributeValues += '":a": ""';
        }

        for(var i = 0; i < areas.length; i++){
            if(i < areas.length - 1){
                filterExpression += "#a = :a" + i + " OR ";
                ExpressionAttributeValues += '":a' + i + '": "' + areas[i].value.toLowerCase() + '", ';
            }else{
                filterExpression += "#a = :a" + i;
                ExpressionAttributeValues += '":a' + i + '": "' + areas[i].value.toLowerCase() + '"';
            }
        }

        filterExpression += ")";
        ExpressionAttributeValues += "}";
        var AttributeValues = JSON.parse(ExpressionAttributeValues);

        var params = {
            TableName : constants.DYN_CATALOG_TABLE,
            FilterExpression: filterExpression,
            ExpressionAttributeNames:{
                "#type": "type",
                "#a": "a"
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

    /**
     * Getting all user's catalogs
     * pu: String, type: number
     * */
    this.getCatalogsOfUser = function(docClient, user_id, ct){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_CATALOG_TABLE,
            FilterExpression: "#pu = :pu and #type = :type",
            ExpressionAttributeNames:{
                "#pu": "pu",
                "#type": "type"
            },
            ExpressionAttributeValues: {
                ":pu": user_id,
                ":type": ct
            }
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

    this.createNewCatalog = function (docClient, catalog) {
        var defer = new jQuery.Deferred();
        var params = catalog.properties;
        params.n = params.n === ""? " ": params.n;
        params.a = params.a === ""? " ": params.a.toLowerCase();
        params.auxName = params.auxName === ""? " ": params.auxName;
        params.cd = JSON.stringify(catalog.elements);
        params.cm = JSON.stringify(catalog.cm);
        params.c = JSON.stringify(catalog.c);
        params.q = JSON.stringify(catalog.q);

        docClient.put({
            "TableName": constants.DYN_CATALOG_TABLE,
            "Item": params
        }, function (err, data) {
            if (err) {
                defer.reject();
            } else {
                defer.resolve();
            }
        });

        return defer.promise();
    };

    this.getCatalog = function(docClient, ci){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_CATALOG_TABLE,
            FilterExpression: "#ci = :ci",
            ExpressionAttributeNames:{
                "#ci": "ci"
            },
            ExpressionAttributeValues: {
                ":ci": ci
            }
        };

        docClient.scan(params, function(err, data) {
            if (err) {
                defer.reject();
            } else {
                defer.resolve(data.Items[0]);
            }
        });

        return defer.promise();
    };

    /**
     * Updating current user data
     * */
    this.updateCatalog = function(docClient, catalog){
        var defer = new jQuery.Deferred();

        var params = {
            TableName: constants.DYN_CATALOG_TABLE,
            Key:{
                "ci": catalog.ci
            },
            UpdateExpression: "set auxName = :auxName, cd = :cd, hasPattern = :hasPattern, n = :n, cm = :cm, c = :c, a = :a, q = :q",
            ExpressionAttributeValues:{
                ":auxName": catalog.auxName,
                ":cd": catalog.cd,
                ":hasPattern": catalog.hasPattern,
                ":n": catalog.n,
                ":cm": catalog.cm,
                ":c": catalog.c,
                ":a": catalog.a.toLowerCase(),
                ":q": catalog.q
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                defer.reject();
            } else {
                defer.resolve(data);
            }
        });

        return defer.promise();
    };

    /**
     * Updating current user data
     * */
    this.updateCatalogHasPattern = function(docClient, catalog){
        var defer = new jQuery.Deferred();

        var params = {
            TableName: constants.DYN_CATALOG_TABLE,
            Key:{
                "ci": catalog.ci
            },
            UpdateExpression: "set hasPattern = :hasPattern",
            ExpressionAttributeValues: {
                ":hasPattern": catalog.hasPattern
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                defer.reject();
            } else {
                defer.resolve();
            }
        });

        return defer.promise();
    };

    this.deleteCatalog = function(docClient, ci){
        var defer = new jQuery.Deferred();

        var params = {
            TableName: constants.DYN_CATALOG_TABLE,
            Key:{
                "ci": ci
            }
        };


        docClient.delete(params, function(err, data) {
            if (err) {
                defer.reject();
            } else {
                defer.resolve(data);
            }
        });

        return defer.promise();
    };
};

module.exports = Catalogs;