var ASSERT = require("assert");
var FS = require("fs");
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
    var out = "out.png";
    map.render({path: out});
    
    ASSERT.ok(FS.isFile(out), out + " exists");
    
    FS.remove(out);
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

