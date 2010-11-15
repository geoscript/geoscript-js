var layers = require("../config").layers;

exports.GET = function(req, parts) {
    
    var layer = layers[parts.pop()];
    if (!layer) {
        throw {notfound: true};
    }
    
    var info = {
        fields: layer.schema.fields.map(function(field) {
            return {
                name: field.name,
                type: field.type
            };
        })
    };
    
    return {
        status: 200,
        headers: {"Content-Type": "application/json"},
        body: [JSON.stringify(info)]
    };
    
};