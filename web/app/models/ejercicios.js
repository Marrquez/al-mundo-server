/**
 * Created by warrdnez on 31/07/16.
 */
var jQuery = require('jquery-deferred');
var constants = require('../utils/constants');

Ejercicio = function (dynamodb) {
    this.dynamodb = dynamodb;

    /**
     * Getting one user by
     * username: String
     * password: String
     * state == 1
     * */
    this.getEjercicio = function(docClient, id){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_EJERCICIOS_TABLE,
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

//*******************************************************
    this.getEjercicesByMuscle = function(docClient, muscles){
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
            TableName : constants.DYN_EJERCICIOS_TABLE,
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

    /*
    *   Busqueda de ejercicio por id
    */
    //**************************************
    this.getEjerciciobyId = function(docClient, id,place){
        var defer = new jQuery.Deferred();
        if(place=="1") {
            var params = {
                TableName: constants.DYN_EJERCICIOS_TABLE,
                ProjectionExpression: [ "nombre","musculo", "pasos", "descripcion","respiracion", "imagen", "gif","repeticiones","series"],
                FilterExpression: "#id = :id",
                ExpressionAttributeNames: {
                    "#id": "id"
                },
                ExpressionAttributeValues: {
                    ":id": id
                }
            };
        }

        if(place=="0") {
            var params = {
                TableName: constants.DYN_WARMUP_TABLE,
                ProjectionExpression: ["imgGif","vchName","vchDescription","vchIntensity"],
                FilterExpression: "#iWarmupId = :id",
                ExpressionAttributeNames: {
                    "#iWarmupId": "iWarmupId"
                },
                ExpressionAttributeValues: {
                    ":id": id
                }
            };
        }

        docClient.scan(params, function(err, data) {
            if (err || data.Items.length === 0) {
                defer.reject();
            } else {
                defer.resolve(data.Items[0]);
            }
        });

        return defer.promise();
    };
    //**************************************

    //<summary>
    // Metodo que busca los ejecicios de estiramiento por el tipo de musculo
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/07</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="muscles">musculo de busqueda</param>
    //<history>
    // Nestor Cepeda - 2017/10/07
    //</history>
    this.getStretchingByMuscle = function(docClient, muscles){
        var defer = new jQuery.Deferred();
        var muscles = JSON.parse(muscles);
        var filterExpression = "";
        var ExpressionAttributeValues = '{ ';

        for(var i = 0; i < muscles.length; i++){
            if(i < muscles.length - 1){
                filterExpression += "#vchMuscles = :m" + i + " OR ";
                ExpressionAttributeValues += '":m' + i + '": "' + muscles[i] + '", ';
            }else{
                filterExpression += "#vchMuscles = :m" + i;
                ExpressionAttributeValues += '":m' + i + '": "' + muscles[i] + '"';
            }
        }

        ExpressionAttributeValues += "}";
        var AttributeValues = JSON.parse(ExpressionAttributeValues);

        var params = {
            TableName : constants.DYN_STRETCHING_TABLE,
            FilterExpression: filterExpression,
            ProjectionExpression: ["vchMuscle","vchDescription","vchImage","vchStretchName"],
            ExpressionAttributeNames:{
                "#vchMuscles": "vchMuscle"
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


    //<summary>
    // Metodo que busca los ejecicios de calentamiento por lugar
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/27</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="place">lugar de busqueda</param>
    //<history>
    // Nestor Cepeda - 2017/10/27
    //</history>
    this.getWarmUpByPlace = function(docClient, place){
        var defer = new jQuery.Deferred();

        var params = {
            TableName : constants.DYN_WARMUP_TABLE,
            ProjectionExpression: ["iWarmupId","iDuration","imgGif","imgImage","vchCorporalZone","vchDescription","vchIntensity","vchName","vchTrainingPlace","vchTrainingType","iRepetition","vchTimeUnit","vchLevel"],
            FilterExpression: "#vchTrainingPlace = :place",
            ExpressionAttributeNames:{
                "#vchTrainingPlace": "vchTrainingPlace"
            },
            ExpressionAttributeValues: {
                ":place": place
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

    //<summary>
    // Metodo que busca los ejecicios de calentamiento por lugar y tipo de entrenamiento
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/27</fecha></para>
    //     <para><version>1.1.000</version><cambio>Modificado</cambio><fecha>2017/11/06</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="place">lugar de busqueda</param>
    //<param name="trainingtype">Tipo de entrenamiento</param>
    //<param name="warnup">boolean para determinar si incluye calentamiento</param>
    //<history>
    // Nestor Cepeda - 2017/10/27
    // Nestor Cepeda - 2017/11/06
    //</history>
    this.getWarmUpByPlaceType = function(docClient, place,trainingtype){

        var defer = new jQuery.Deferred();
        var mType = JSON.parse(trainingtype);
        var filterExpression = "(";
        var ExpressionAttributeValues = '{ ';

        for(var i = 0; i < mType.length; i++){
            if(i < mType.length - 1){
                filterExpression += "#vchTrainingType = :m" + i + " OR ";
                ExpressionAttributeValues += '":m' + i + '": "' + mType[i] + '", ';
            }else{
                filterExpression += "#vchTrainingType = :m" + i;
                ExpressionAttributeValues += '":m' + i + '": "' + mType[i] + '"';
            }
        }


        ExpressionAttributeValues += ',":place": "' + place + '"' ;
        ExpressionAttributeValues += "}";
        filterExpression += ") AND (#vchTrainingPlace = :place)";
        var AttributeValues = JSON.parse(ExpressionAttributeValues);

        var params = {
            TableName : constants.DYN_WARMUP_TABLE,
            FilterExpression: filterExpression,
            ProjectionExpression: ["iWarmupId", "iDuration", "imgGif", "imgImage", "vchCorporalZone", "vchDescription", "vchIntensity", "vchName", "vchTrainingPlace", "vchTrainingType", "iRepetition", "vchTimeUnit", "vchLevel"],
            ExpressionAttributeNames:{
                "#vchTrainingType": "vchTrainingType",
                "#vchTrainingPlace": "vchTrainingPlace"
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

    //<summary>
    // Metodo que busca los ejecicios de calentamiento por lugar y tipo de entrenamiento
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/27</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="place">lugar de busqueda</param>
    //<param name="trainingtype">Tipo de entrenamiento</param>
    //<param name="corporalZone">zona corporal</param>
    //<history>
    // Nestor Cepeda - 2017/10/27
    //</history>
    this.getWarmUpByPlaceTypeZone = function(docClient, place,trainingtype,corporalZone){

        var defer = new jQuery.Deferred();
        var mType = JSON.parse(trainingtype);
        var filterExpression = "(";
        var ExpressionAttributeValues = '{ ';

        for(var i = 0; i < mType.length; i++){
            if(i < mType.length - 1){
                filterExpression += "#vchTrainingType = :m" + i + " OR ";
                ExpressionAttributeValues += '":m' + i + '": "' + mType[i] + '", ';
            }else{
                filterExpression += "#vchTrainingType = :m" + i;
                ExpressionAttributeValues += '":m' + i + '": "' + mType[i] + '"';
            }
        }


        ExpressionAttributeValues += ',":place": "' + place + '"' ;
        ExpressionAttributeValues += ',":Zone": "' + corporalZone + '"' ;
        ExpressionAttributeValues += "}";
        filterExpression += ") AND (#vchTrainingPlace = :place) AND (#vchCorporalZone = :Zone)";
        var AttributeValues = JSON.parse(ExpressionAttributeValues);

        var params = {
            TableName : constants.DYN_WARMUP_TABLE,
            FilterExpression: filterExpression,
            ProjectionExpression: ["iWarmupId", "iDuration", "imgGif", "imgImage", "vchCorporalZone", "vchDescription", "vchIntensity", "vchName", "vchTrainingPlace", "vchTrainingType", "iRepetition", "vchTimeUnit", "vchLevel"],
            ExpressionAttributeNames:{
                "#vchTrainingType": "vchTrainingType",
                "#vchTrainingPlace": "vchTrainingPlace",
                "#vchCorporalZone": "vchCorporalZone"
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

module.exports = Ejercicio;
