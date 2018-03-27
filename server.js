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

/**
 * in order to fix: No 'Access-Control-Allow-Origin'
 * to allow request from all origins
 * */
app.use(cors({origin: '*'}));


/**
 * config response types and formats
 * */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * implementar y personalizar metodos http
 */
app.use(methodOverride());
app.use(morgan("dev"));

/**
 * End points
 * */
app.get('/get-hotels', HotelController.getHotels);
app.get('/get-hotels-by-stars', HotelController.getHotelsByStars);
app.get('/', function(req, res){
    var result = "Hi everyone, base request!";
    res.status(200);
    res.jsonp(result);
});


/**
 * run the server
 * */
app.use(router);
app.listen(port, function(){
    console.log('Listening on port: ' + port);
});
