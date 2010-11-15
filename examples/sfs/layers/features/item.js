var layers = require("../../config").layers;

exports.GET = function(req, parts) {
    
    var len = parts.length;
    var featureId = parts[len-1];
    var layerId = parts[len-3];
    
    var layer = layers[layerId];
    if (!layer) {
        throw {notfound: true};
    }
    
    var feature = layer.get(featureId);
    if (!feature) {
        throw {notfound: true};
    }
    
    return {
        status: 200,
        headers: {"Content-Type": "application/json"},
        body: [feature.json]
    };
    
};