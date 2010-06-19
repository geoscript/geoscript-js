var assert = require("assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");

var database = "geoscript";

exports["test: constructor"] = function() {

    var ws = new workspace.PostGIS();
    
    assert.ok(ws instanceof workspace.Workspace, "instanceof Workspace");
    assert.ok(ws instanceof workspace.PostGIS, "instanceof PostGIS");
    
    ws.close();

};

exports["test: names"] = function() {

    var ws = new workspace.PostGIS({database: database});
    assert.ok(ws.names.indexOf("states") > -1, "ws.names includes 'states'");

    ws.close();
    
};

exports["test: get"] = function() {

    var ws = new workspace.PostGIS({database: database});
    
    var states = ws.get("states");
    assert.ok(states instanceof layer.Layer, "get returns a layer instance");

    ws.close();

};

if (require.main == module.id) {
    require("test").run(exports);
}
