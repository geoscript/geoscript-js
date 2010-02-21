var assert = require("test/assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");
var file = require("file");

var database = "geoscript";

exports["test: constructor"] = function() {

    var ws = new workspace.PostGIS();
    
    assert.isTrue(ws instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(ws instanceof workspace.PostGIS, "instanceof PostGIS");
    
    ws.close();

};

exports["test: names"] = function() {

    var ws = new workspace.PostGIS({database: database});
    assert.isTrue(ws.names.indexOf("states") > -1, "ws.names includes 'states'");

    ws.close();
    
};

exports["test: get"] = function() {

    var ws = new workspace.PostGIS({database: database});
    
    var states = ws.get("states");
    assert.isTrue(states instanceof layer.Layer, "get returns a layer instance");

    ws.close();

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
