var assert = require("test/assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");
var file = require("file");

var admin = require("../../admin");

var dataDir = admin.h2.dest;
exports.setup = admin.h2.setup;
exports.teardown = admin.h2.teardown;

exports["test: constructor"] = function() {

    var h2 = new workspace.H2();
    
    assert.isTrue(h2 instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(h2 instanceof workspace.H2, "instanceof H2");    

};

exports["test: names"] = function() {

    var h2 = new workspace.H2({database: file.join(dataDir, "geoscript")});
    // TODO: confirm that "_GEOH2" should be in names
    assert.isTrue(h2.names.indexOf("states") > -1, "h2.names includes 'states'");
    
};

exports["test: get"] = function() {

    var h2 = new workspace.H2({database: file.join(dataDir, "geoscript")});
    
    var states = h2.get("states");
    assert.isTrue(states instanceof layer.Layer, "get returns a layer instance");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}

