var layers = require("../../config").layers;
/*
 * Use GData feed filter syntax.
 * http://code.google.com/apis/analytics/docs/gdata/gdataReferenceDataFeed.html#filterSyntax
 */

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
    
    var cursor = layer.features;
    if (params.start) {
        cursor.skip(Number(params.start));
    }
    var count = params.count && Number(params.count);
    
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
