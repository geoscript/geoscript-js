var ASSERT = require("assert");
var LAYER = require("geoscript/layer");
var ADMIN = require("../admin");
var Map = require("geoscript/map").Map;

var shpDir = ADMIN.shp.dest;
exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

exports["test: render"] = function() {
    
    var states = LAYER.create({
        workspace: shpDir,
        name: "states"
    });

    states.style = {
        rules: [{
            symbolizers: [{
                type: "PolygonSymbolizer",
                fillColor: "#cc3300",
                strokeColor: "#ffcc66"
            }]
        }]
    };
    
    var map = new Map();
    map.add(states);
    map.render({path: "out.png"});
    
};

if (require.main == module.id) {
    require("test").run(exports);
}

