var layers = require("../config").layers;

exports.GET = function(req) {
    
    var layer, index = [];
    for (var id in layers) {
        layer = layers[id];
        index.push({
            name: id,
            bbox: layer.bounds.toArray(),
            crs: "urn:ogc:def:crs:" + layer.projection.id
        });
    }
    
    return {
        status: 200,
        headers: {"Content-Type": "text/plain"},
        body: [JSON.stringify(index)]
    };
    
};