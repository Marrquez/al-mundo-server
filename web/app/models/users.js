/**
 * Created by warrdnez on 31/07/16.
 */
var jQuery = require('jquery-deferred');
var constants = require('../utils/constants');

Users = function (dynamodb) {
    this.dynamodb = dynamodb;

    /**
     * Getting one user by
     * username: String
     * password: String
     * state == 1
     * */
    this.getDomainUser = function(docClient, uk){
        var defer = new jQuery.Deferred();
        var params = {
            TableName : constants.DYN_USERS_TABLE,
            FilterExpression: "#uk = :uk",
            ExpressionAttributeNames:{
                "#uk": "uk"
            },
            ExpressionAttributeValues: {
                ":uk": uk
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
    //<summary>
    // Metodo que inserta los datos de un usuario
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/09/21</fecha></para>
    //     <para><version>1.1.000</version><cambio>se agregan las columnas de peso, altura, session e indice de masa corporal</cambio><fecha>2017/10/06</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">identificador del usuario</param>
    //<param name="Username">Nombre del usuario</param>
    //<param name="Points">puntaje a asignarle al usuario</param>
    //<history>
    // Nestor Cepeda - 2017/09/21
    // Nestor Cepeda - 2017/10/06
    //</history>
    this.InsertUserData = function (docClient, idUser, Username, Points,Height,Weight,Session,Imc){
        var defer = new jQuery.Deferred();

        var params = {
            TableName : constants.DYN_USER_TABLE,
            Key:{"iUserId": {"S":idUser},
                "vchUsername": {"S":Username},
                "iPoints": {"N":Points},
                "dtLastSession":{"S":"-"},
                "fHeight":{"N":Height},
                "iWeight":{"N":Weight},
                "vchSession":{"S":Session},
                "iImc":{"N":Imc}
            },
            Item:{
                'iUserId': idUser,
                'vchUsername': Username,
                'iPoints': Points,
                'dtLastSession': "-",
                "fHeight":Height,
                "iWeight":Weight,
                "vchSession":Session,
                "iImc":Imc
            }
        };

        docClient.put(params, function(err, data) {
            if (err ) {
                defer.reject();
                console.log("Unable to insert item. Error: ", JSON.stringify(err, null, 2));
            } else {
                defer.resolve();
                console.log("Inserted item succeeded: ", JSON.stringify(data, null, 2));
            }
        });

        return defer.promise();
    };
    //**************************************
    //<summary>
    // Metodo que consulta la ingformacion del usuario por medio del id de usuari
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/09/23</fecha></para>
    //     <para><version>1.1.000</version><cambio>Se agrega la columna dtLastSession</cambio><fecha>2017/09/24</fecha></para>
    //     <para><version>1.2.000</version><cambio>Se agrega la columna vchsession, fHeight, iWeight</cambio><fecha>2017/10/04</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">Identifica el identificador del usuario</param>
    //<history>
    // Nestor Cepeda - 2017/09/21
    // Nestor Cepeda - 2017/09/24
    // Nestor Cepeda - 2017/10/04
    //</history>
    this.getUserInfo = function(docClient, idUser){
        var defer = new jQuery.Deferred();

        var params = {

            ProjectionExpression: ["iUserId","vchUsername","iPoints","dtLastSession","vchSession","fHeight","iWeight","iImc"],
            ExpressionAttributeNames:{
                "#iUserId": "iUserId"
            },
            ExpressionAttributeValues: {
                ":iUserId": idUser
            },
            FilterExpression: "#iUserId = :iUserId",
            TableName: constants.DYN_USER_TABLE
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
    //<summary>
    // Metodo que actualiza los puntos de un usuario
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/09/23</fecha></para>
    //     <para><version>1.1.000</version><cambio>Se agrega la fecha de la ultima sesion</cambio><fecha>2017/09/24</fecha></para>
    //     <para><version>1.1.000</version><cambio>Se agrega la fecha de inicio y fin de la sesion para actualizarla en la
    //         auditoria</cambio><fecha>2017/09/25</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">identificador del usuario</param>
    //<param name="Points">puntaje a asignarle al usuario</param>
    //<param name="lastSession">Fecha de la ultima sesion</param>
    //<history>
    // Nestor Cepeda - 2017/09/23
    // Nestor Cepeda - 2017/09/24
    // Nestor Cepeda - 2017/09/25
    //</history>
    this.UpdateUserPoints = function (dynamodb, docClient, idUser, Points, dBegin, dEnd){
        var defer = new jQuery.Deferred();

        var params = {
            TableName : constants.DYN_USER_TABLE,
            Key:{"iUserId": {"S":idUser}},
            UpdateExpression:"SET iPoints = :ipts, dtLastSession = :dtlastSess",
            ExpressionAttributeValues:{":ipts": {"N":Points},":dtlastSess": {"S":dEnd}},
            ReturnValues: "UPDATED_NEW"
        };

        dynamodb.updateItem(params, function(err, data) {
            if (err ) {
                defer.reject();
                console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
            } else {
                defer.resolve();
                console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            }
        });

        //*****************************
        var uuid = require('uuid');
        uuid.v1();

        var params1 = {
            TableName : constants.DYN_USERSESSIONLOG_TABLE,
            Item:{
                "iUserSessionLog": uuid.v1(),
                "iUserId": idUser,
                'dtSessionBegin': dBegin,
                'dtSessionEnd': dEnd

            }
        };

        docClient.put(params1, function(err1, data1) {
            if (err1 ) {
                defer.reject();
                console.log("Unable to insert item. Error: ", JSON.stringify(err1, null, 2));
            } else {
                defer.resolve();
                console.log("Inserted item succeeded: ", JSON.stringify(data1, null, 2));
            }
        });

        //*****************************

        return defer.promise();
    };
    //<summary>
    // Metodo que inserta el log de la sesiones de un usuario
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/09/23</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">identificador del usuario</param>
    //<param name="begin">fecha de inicio de la sesion</param>
    //<param name="end">fecha de fin de la sesion</param>
    //<history>
    // Nestor Cepeda - 2017/09/23
    //</history>
    this.InsertUserSSLog = function (docClient, idUser, dBegin, dEnd){
        var defer = new jQuery.Deferred();
        var uuid = require('uuid');
        uuid.v1();

        var params = {
            TableName : constants.DYN_USERSESSIONLOG_TABLE,
            Item:{
                "iUserSessionLog": uuid.v1(),
                "iUserId": idUser,
                'dtSessionBegin': dBegin,
                'dtSessionEnd': dEnd

            }
        };

        docClient.put(params, function(err, data) {
            if (err ) {
                defer.reject();
                console.log("Unable to insert item. Error: ", JSON.stringify(err, null, 2));
            } else {
                defer.resolve();
                console.log("Inserted item succeeded: ", JSON.stringify(data, null, 2));
            }
        });

        return defer.promise();
    };
    //<summary>
    // Metodo que inserta un dato en la columna determinada de la tabla de usuario
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/04</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">identificador del usuario</param>
    //<param name="vchColumn">Nombre de la columna a actualizar</param>
    //<param name="vchData">Valor del dato</param>
    //<history>
    // Nestor Cepeda - 2017/10/04
    //</history>
    this.UpdateUserDataColumn = function (dynamodb, idUser, vchColumn, vchData){

        var defer = new jQuery.Deferred();

        var params = {
            TableName : constants.DYN_USER_TABLE,
            Key:{"iUserId": {"S":idUser}},
            //UpdateExpression:"SET vchSession = :vSession",

            UpdateExpression:"SET " + vchColumn + " = :vSession",
            ExpressionAttributeValues:{":vSession": {"S":vchData}},
            ReturnValues: "UPDATED_NEW"
        };

        dynamodb.updateItem(params, function(err, data) {
            if (err ) {
                defer.reject();
                console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
            } else {
                defer.resolve();
                console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            }
        });

        return defer.promise();


    };
    //<summary>
    // Metodo que actualiza el peso, la altura y el IMC de un usuario
    //</summary>
    //<remarks>
    //     <para><version>1.0.000</version><cambio>Creado</cambio><fecha>2017/10/07</fecha></para>
    //</remarks>
    //<param name="docClient">Identifica la conexion a la base de datos
    //<param name="idUser">identificador del usuario</param>
    //<param name="weight">peso del usuario</param>
    //<param name="height">altura del usuario</param>
    //<param name="imc">indice de masa corporal</param>
    //<history>
    // Nestor Cepeda - 2017/10/07
    //</history>
    this.UpdateUserSize = function (dynamodb, idUser,weight ,height, imc){
        var defer = new jQuery.Deferred();

        var params = {
            TableName : constants.DYN_USER_TABLE,
            Key:{"iUserId": {"S":idUser}},
            UpdateExpression:"SET iWeight = :iiweight, fHeight = :ffheight, iImc = :iiimc",
            ExpressionAttributeValues:{":iiweight": {"N":weight},":ffheight": {"N":height},":iiimc": {"N":imc}},
            ReturnValues: "UPDATED_NEW"
        };

        dynamodb.updateItem(params, function(err, data) {
            if (err ) {
                defer.reject();
                console.log("Unable to update item. Error: ", JSON.stringify(err, null, 2));
            } else {
                defer.resolve();
                console.log("Updated item succeeded: ", JSON.stringify(data, null, 2));
            }
        });


        return defer.promise();
    };



};

module.exports = Users;






