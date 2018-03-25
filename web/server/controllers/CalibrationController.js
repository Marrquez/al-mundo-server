/**
 * Calibrating the data
 * @param req
 * @param res
 */
exports.calibrate = function (req, res) {
    var result = {
        data: {"tmpl":req.body.tmpl, "pattern": req.body.pattern},
        error: null
    };

    console.log(JSON.stringify(result.data));
    res.status(200);
    res.jsonp(result);
};

exports.getCalibration = function (req, res) {
    var result = {
        data: {"test": "test..."}
    };

    res.status(200);
    res.jsonp(result);
};