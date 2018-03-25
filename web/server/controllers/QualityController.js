/**
 * Calibrating the data
 * @param req
 * @param res
 */
exports.quality = function (req, res) {
    var self = this;
    var form = JSON.parse(req.body.tmpl);
    self.qualities = [];
    var result = {
        data: {},
        error: null
    };

    self.calculateSUM = function(elements){
        var sum = 0;
        var total = 0;

        var visibles = elements.filter(function(element){
            return (element.render && element.render.properties.display === true) || (element.container && element.container.properties.display === true);
        });

        for(var i = 0; i < visibles.length; i++){
            var element = visibles[i];

            if(element.render){
                if(element.render.properties.value && element.render.properties.value.toString().toLowerCase() === element.render.properties.correct.toString().toLowerCase()){
                    sum += element.render.properties.weight;
                    total++;
                }
            }
        }

        return {"sum": sum, "corrects": total};
    };

    self.calculateAVG = function(elements){
        var sum = 0;
        var total = 0;
        var corrects = 0;

        var visibles = elements.filter(function(element){
            return (element.render && element.render.properties.display === true) || (element.container && element.container.properties.display === true);
        });

        for(var i = 0; i < visibles.length; i++){
            var element = visibles[i];

            if(element.render){
                if(element.render.properties.value && element.render.properties.value.toString().toLowerCase() === element.render.properties.correct.toString().toLowerCase()){
                    sum += element.render.properties.weight;
                    corrects++;
                }

                total++;
            }
        }

        return {"avg": sum/total, "corrects": corrects};
    };

    self.calculateADVAVG = function(elements){
        var sum = 0;
        var corrects = 0;
        var totalWeight = 0;

        var visibles = elements.filter(function(element){
            return (element.render && element.render.properties.display === true) ||
                        (element.container && element.container.properties.display === true);
        });

        var notAppliers = visibles.filter(function(element){
            return (element.render && element.render.properties.value && element.render.properties.distribution &&
                        element.render.properties.value.toString().toLowerCase() === element.render.properties.distribution.toString().toLowerCase());
        });

        var appliers = visibles.filter(function(element){
            if(element.render && element.render.properties.value && element.render.properties.distribution &&
                element.render.properties.value.toString().toLowerCase() !== element.render.properties.distribution.toString().toLowerCase()){
                totalWeight += element.render.properties.weight;
                return true;
            }else{
                return false;
            }
        });

        for(var i = 0; i < appliers.length; i++){
            var element = appliers[i];
            if(!element.render.properties.weight){
                element.render.properties.weight = 0;
            }

            var prom = ( element.render.properties.weight * 100 ) / totalWeight;

            for(var j = 0; j < notAppliers.length; j++){
                var subEle = notAppliers[j];
                if(!subEle.render.properties.weight){
                    subEle.render.properties.weight = 0;
                }

                element.render.properties.weight += ( prom / 100) * subEle.render.properties.weight;
            }
        }

        for(var i = 0; i < appliers.length; i++){
            var element = appliers[i];

            if(element.render.properties.value.toString().toLowerCase() === element.render.properties.correct.toString().toLowerCase()){
                sum += element.render.properties.weight;
                corrects++;
            }
        }

        return {"advavg": sum, "corrects": corrects};
    };

    self.calculateBOOL = function(){};

    self.calculate = function(elements){
        var self = this;

        for(var i = 0; i < elements.length; i++){
            var element = elements[i];

            if(element.container && element.container.properties.display){
                var calcResult = {
                    groupName: "",
                    operator: "",
                    result: {}
                };

                calcResult.groupName = element.container.properties.displayName;

                switch (element.container.properties.value){
                    case "sum":
                        calcResult.operator = "sum";
                        calcResult.result = self.calculateSUM(element.container.elements);
                        self.qualities.push(calcResult);
                        break;

                    case "avg":
                        calcResult.operator = "avg";
                        calcResult.result = self.calculateAVG(element.container.elements);
                        self.qualities.push(calcResult);
                        break;

                    case "advavg":
                        calcResult.operator = "advavg";
                        calcResult.result = self.calculateADVAVG(element.container.elements);
                        self.qualities.push(calcResult);
                    break;

                    case "bool":
                        self.calculateBOOL(element.container.elements);
                    break;

                    default:
                    break;
                }
            }
        }
    };

    if(form.length > 0){
        self.calculate(form);
        result.data.quality = self.qualities;
    }else {
        result.data.precision = 0;
    }

    res.status(200);
    res.jsonp(result);
};

exports.getQuality = function (req, res) {
    var result = {
        data: {"test": "test... quality"}
    };

    res.status(200);
    res.jsonp(result);
};