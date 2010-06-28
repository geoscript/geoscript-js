var assert = require("assert");
var workspace = require("geoscript/workspace");
var layer = require("geoscript/layer");

var admin = require("../../admin");

var dataDir = admin.shp.dest;
exports.setUp = admin.shp.setUp;
exports.tearDown = admin.shp.tearDown;

exports["test: constructor"] = function() {

    var dir = new workspace.Directory();
    
    assert.ok(dir instanceof workspace.Workspace, "instanceof Workspace");
    assert.ok(dir instanceof workspace.Directory, "instanceof Directory"); 
    
    dir.close();   

};

exports["test: names"] = function() {

    var dir = new workspace.Directory(dataDir);    

    assert.deepEqual(dir.names, ["states"], "dir.names is array of string names");

    dir.close();   
    
};

exports["test: layers"] = function() {

    var dir = new workspace.Directory(dataDir);    
    var layers = dir.layers;
    assert.ok(layers instanceof Array, "got layers array");
    assert.equal(layers.length, 1, "one layer in workspace");
    assert.ok(layers[0] instanceof layer.Layer, "first element is layer");

    dir.close();   
    
};

exports["test: get"] = function() {

    var dir = new workspace.Directory(dataDir);
    var l = dir.get(dir.names[0]);
    
    assert.ok(l instanceof layer.Layer, "get returns a layer instance");
    
    assert.throws(function() {dir.get("foo")}, Error, "getting invalid name throws error");

    dir.close();   
    
};

if (require.main == module.id) {
    require("test").run(exports);
}

