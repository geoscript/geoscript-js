var assert = require("test/assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");
var file = require("file");

var admin = require("../../admin");

var database = file.join(admin.h2.dest, "geoscript");
exports.setup = admin.h2.setup;
exports.teardown = admin.h2.teardown;

exports["test: constructor"] = function() {

    var h2 = new workspace.H2();
    
    assert.isTrue(h2 instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(h2 instanceof workspace.H2, "instanceof H2");    
    
    h2.close();

};

exports["test: names"] = function() {

    var h2 = new workspace.H2({database: database});
    // TODO: change this when "_GEOH2" is filtered from layer names
    assert.isTrue(h2.names.indexOf("states") > -1, "h2.names includes 'states'");

    h2.close();
    
};

exports["test: get"] = function() {

    var h2 = new workspace.H2({database: database});
    
    var states = h2.get("states");
    assert.isTrue(states instanceof layer.Layer, "get returns a layer instance");

    h2.close();

};

if (require.main == module) {
    require("test/runner").run(exports);
}
