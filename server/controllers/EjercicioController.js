/**
 * Calibrating the data
 * @param req
 * @param res
 */
var awsSingleton = require("../../app/awsconfig/config.js");
var aws = new awsSingleton();
var docClient = aws.docClient;
var jQuery = require('jquery-deferred');

exports.getEjercicio = function (req, res) {
    var id = req.query.id;
    console.log(id);
    jQuery.when(aws.DynamoEjercicios.getEjercicio(docClient, id)).done(function(resp){
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function(){
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});
    });
};

exports.getEjercicesByMuscle = function (req, res) {
    var muscles = req.query.muscles;
    console.log(muscles);
    jQuery.when(aws.DynamoEjercicios.getEjercicesByMuscle(docClient, muscles)).done(function(resp){
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function(){
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});
    });
};


exports.getStretchingByMuscle = function (req, res) {
    var muscles = req.query.muscles;
    console.log(muscles);
    jQuery.when(aws.DynamoEjercicios.getStretchingByMuscle(docClient, muscles)).done(function(resp){
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function(){
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});
    });
};

exports.getEjerciciobyId = function (req, res) {
    var id = req.query.id;
    var place = req.query.place;
    console.log(id);
    console.log(place);
    jQuery.when(aws.DynamoEjercicios.getEjerciciobyId(docClient, id,place)).done(function (resp) {
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function () {
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});

    });
}

exports.getWarmUpByPlace = function (req, res) {
        var place = req.query.place;
        console.log(place);
        jQuery.when(aws.DynamoEjercicios.getWarmUpByPlace(docClient, place)).done(function(resp){
            res.status(200);
            res.jsonp({"data": resp});
        }).fail(function(){
            res.status(204);
            res.jsonp({"error": "mai_server_loggin_locked_user"});
        });
    };

exports.getWarmUpByPlaceType = function (req, res) {
    var place = req.query.place;
    var type = req.query.trainingType;
    console.log(place);
    console.log(type);
    jQuery.when(aws.DynamoEjercicios.getWarmUpByPlaceType(docClient, place,type)).done(function(resp){
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function(){
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});
    });
};

exports.getWarmUpByPlaceTypeZone = function (req, res) {
    var place = req.query.place;
    var type = req.query.trainingType;
    var zone = req.query.corporalZone;
    console.log(place);
    console.log(type);
    console.log(zone);
    jQuery.when(aws.DynamoEjercicios.getWarmUpByPlaceTypeZone(docClient, place,type,zone)).done(function(resp){
        res.status(200);
        res.jsonp({"data": resp});
    }).fail(function(){
        res.status(204);
        res.jsonp({"error": "mai_server_loggin_locked_user"});
    });
};

