var layers = require("../../config").layers;
var Filter = require("geoscript/filter").Filter;

exports.GET = function(req, parts) {
    var params = req.queryParams || {};
    
    var len = parts.length;
    var layerId = parts[len-3];
    
    var layer = layers[layerId];
    if (!layer) {
        throw {notfound: true};
    }
    
    var header = '{"type": "FeatureCollection", "features": [';
    var footer = ']}\n';
    
    var filter = params.filter;
    if (filter) {
        try {
            filter = new Filter(filter);
        } catch(err) {
            return {
                status: 400,
                headers: {"Content-Type": "application/json"},
                body: [JSON.stringify({error: true, message: "Bad filter syntax."})]
            }
        }
    }
    
    var cursor = layer.query(filter);
    if (params["start-index"]) {
        cursor.skip(Number(params["start-index"]));
    }
    var count = params["max-results"] && Number(params["max-results"]);
    
    var body = {
        forEach: function(callback) {
            callback(header);
            cursor.forEach(function(feature, index) {
                callback((index && ", " || "") + feature.json);
                return count ? (index < count-1) : true;
            });
            cursor.close();
            callback(footer);
        }
    }
    
    return {
        status: 200,
        headers: {"Content-Type": "application/json"},
        body: body
    };
    
};
