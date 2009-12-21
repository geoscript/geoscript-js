var assert = require("test/assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");

var file = require("file");
var path = file.resolve(module.path, "../../data/");

exports["test: constructor"] = function() {

    var dir = new workspace.DirectoryWorkspace();
    
    assert.isTrue(dir instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(dir instanceof workspace.DirectoryWorkspace, "instanceof DirectoryWorkspace");    

};

exports["test: names"] = function() {

    var dir = new workspace.DirectoryWorkspace(path);
    
    assert.isSame(["states"], dir.names, "dir.names is array of string names");
    
};

exports["test: get"] = function() {

    var dir = new workspace.DirectoryWorkspace(path);
    
    var l = dir.get(dir.names[0]);
    
    assert.isTrue(l instanceof layer.Layer, "get returns a layer instance");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}

