var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");
var LAYER = require("geoscript/layer");

var database = "geoscript";

exports["test: constructor"] = function() {

    var ws = new WORKSPACE.PostGIS();
    
    ASSERT.ok(ws instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(ws instanceof WORKSPACE.PostGIS, "instanceof PostGIS");
    
    ws.close();

};

exports["test: names"] = function() {

    var ws = new WORKSPACE.PostGIS({database: database});
    ASSERT.ok(ws.names.indexOf("states") > -1, "ws.names includes 'states'");

    ws.close();
    
};

exports["test: get"] = function() {

    var ws = new WORKSPACE.PostGIS({database: database});
    
    var states = ws.get("states");
    ASSERT.ok(states instanceof LAYER.Layer, "get returns a layer instance");

    ws.close();

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
