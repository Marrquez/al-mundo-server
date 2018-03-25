/**
 * Created by warrdnez on 23/03/18.
 */
var connect                 = require('connect');
var http                    = require('http');
var express                 = require("express");
var app                     = express();
var morgan                  = require("morgan");
var port                    = process.env.PORT || 8080;
var bodyParser              = require("body-parser");
var methodOverride          = require("method-override");
var router                  = express.Router();
var HotelController     = require('./server/controllers/HotelController');
var cors                    = require('cors');

// in order to fix: No 'Access-Control-Allow-Origin'
app.use(cors({origin: '*'}));
//app.use(cors({origin: 'http://kiinitro.s3-website-us-west-2.amazonaws.com'}));

//para permitir parsear jsons
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//implementar y personalizar metodos http
app.use(methodOverride());
app.use(morgan("dev"));

/*app.get('/get-ejercicio', EjercicioController.getEjercicio);
app.get('/get-ejercicesByMuscle', EjercicioController.getEjercicesByMuscle);
app.get('/get-ejercicioById', EjercicioController.getEjerciciobyId);
app.get('/get-userInfo', UserController.getUserInfo);
app.post('/ins-userInfo', UserController.InsertUserData);
app.put('/upd-userPoints', UserController.UpdateUserPoints);
app.post('/ins-userSessioLog', UserController.InsertUserSSLog);
app.put('/upd-userColumnData', UserController.UpdateUserDataColumn);
app.put('/upd-userSize', UserController.UpdateUserSize);
app.get('/get-stretchByMuscle', EjercicioController.getStretchingByMuscle);
app.get('/get-warmUpByPlace', EjercicioController.getWarmUpByPlace);
app.get('/get-warmUpByPlaceType', EjercicioController.getWarmUpByPlaceType);
app.get('/get-warmUpByPlaceTypeZone', EjercicioController.getWarmUpByPlaceTypeZone);*/
//app.get('/get-warmUp', EjercicioController.getWarmUpByPlace);


/*app.post('/quality/:params', QualityController.quality);
app.get('/quality', QualityController.getQuality);
app.post('/catalog/:params', CatalogController.createCatalog);
app.put('/catalog/:params', CatalogController.updateCatalog);
app.delete('/catalog/:params', CatalogController.deleteCatalog);
app.get('/catalog/:params', CatalogController.getCatalogs);
app.get('/user/:id', UserController.getUser);
app.post('/calibrate', CalibrationController.calibrate);
app.get('/calibrate', CalibrationController.getCalibration);*/

app.get('/', function(req, res){
    var result = "Hi everyone!";
    res.status(200);
    res.jsonp(result);
});

app.use(router);
app.listen(port, function(){
    console.log('Listening on port: ' + port);
});
