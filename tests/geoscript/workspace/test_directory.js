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
    
    dir.close();   

};

exports["test: names"] = function() {

    var dir = new workspace.Directory(dataDir);    

    assert.isSame(["states"], dir.names, "dir.names is array of string names");

    dir.close();   
    
};

exports["test: get"] = function() {

    var dir = new workspace.Directory(dataDir);
    var l = dir.get(dir.names[0]);
    
    assert.isTrue(l instanceof layer.Layer, "get returns a layer instance");

    dir.close();   
    
};

if (require.main == module) {
    require("test/runner").run(exports);
}

