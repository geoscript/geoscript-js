var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");
var LAYER = require("geoscript/layer");
var FS = require("fs");
var admin = require("../../admin");

var database = FS.join(admin.h2.dest, "geoscript");
exports.setUp = admin.h2.setUp;
exports.tearDown = admin.h2.tearDown;

exports["test: constructor"] = function() {

    var h2 = new WORKSPACE.H2();
    
    ASSERT.ok(h2 instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(h2 instanceof WORKSPACE.H2, "instanceof H2");    
    
    h2.close();

};

exports["test: names"] = function() {

    var h2 = new WORKSPACE.H2({database: database});
    // TODO: change this when "_GEOH2" is filtered from layer names
    ASSERT.ok(h2.names.indexOf("states") > -1, "h2.names includes 'states'");

    h2.close();
    
};

exports["test: get"] = function() {

    var h2 = new WORKSPACE.H2({database: database});
    
    var states = h2.get("states");
    ASSERT.ok(states instanceof LAYER.Layer, "get returns a layer instance");

    h2.close();

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
