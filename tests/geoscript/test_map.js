var ASSERT = require("assert");
var FS = require("fs");
var LAYER = require("geoscript/layer");
var Fill = require("geoscript/style").Fill;
var Stroke = require("geoscript/style").Stroke;
var ADMIN = require("../admin");
var Map = require("geoscript/map").Map;

var shpDir = ADMIN.shp.dest;
exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

exports["test: render"] = function() {
    
    var map = Map({
        layers: [{
            workspace: shpDir,
            name: "states",
            style: Stroke("#ffcc66").and(Fill("#cc3300"))
        }]
    });

    var out = "out.png";
    map.render({path: out});
    
    ASSERT.ok(FS.isFile(out), out + " exists");
    
    FS.remove(out);

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

