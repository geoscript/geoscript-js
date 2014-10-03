var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");
var LAYER = require("geoscript/layer");
var FS = require("fs");
var admin = require("../../admin");

var database = FS.join(admin.geopkg.dest, "geoscript.gpkg");
exports.setUp = admin.geopkg.setUp;
exports.tearDown = admin.geopkg.tearDown;

exports["test: constructor"] = function() {

    var geopkg = new WORKSPACE.GeoPackage();
    
    ASSERT.ok(geopkg instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(geopkg instanceof WORKSPACE.GeoPackage, "instanceof GeoPackage");
    
    geopkg.close();

};

exports["test: names"] = function() {

    var geopkg = new WORKSPACE.GeoPackage({database: database});

    ASSERT.ok(geopkg.names.indexOf("states") > -1, "geopkg.names includes 'states'");

    geopkg.close();
    
};

exports["test: get"] = function() {

    var geopkg = new WORKSPACE.GeoPackage({database: database});
    
    var states = geopkg.get("states");
    ASSERT.ok(states instanceof LAYER.Layer, "get returns a layer instance");

    geopkg.close();

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
