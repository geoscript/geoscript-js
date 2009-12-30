var assert = require("test/assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");

var admin = require("../../admin");

var dataDir = admin.shp.dest;
exports.setup = admin.shp.setup;
exports.teardown = admin.shp.teardown;

exports["test: constructor"] = function() {

    var dir = new workspace.Directory();
    
    assert.isTrue(dir instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(dir instanceof workspace.Directory, "instanceof Directory");    

};

exports["test: names"] = function() {

    var dir = new workspace.Directory(dataDir);
    
    assert.isSame(["states"], dir.names, "dir.names is array of string names");
    
};

exports["test: get"] = function() {

    var dir = new workspace.Directory(dataDir);
    
    var l = dir.get(dir.names[0]);
    
    assert.isTrue(l instanceof layer.Layer, "get returns a layer instance");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}

