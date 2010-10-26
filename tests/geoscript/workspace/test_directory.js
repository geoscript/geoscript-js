var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");
var LAYER = require("geoscript/layer");

var ADMIN = require("../../admin");

var dataDir = ADMIN.shp.dest;
exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

exports["test: constructor"] = function() {

    var dir = new WORKSPACE.Directory();
    
    ASSERT.ok(dir instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(dir instanceof WORKSPACE.Directory, "instanceof Directory"); 
    
    dir.close();   

};

exports["test: names"] = function() {

    var dir = new WORKSPACE.Directory(dataDir);    

    ASSERT.deepEqual(dir.names, ["states"], "dir.names is array of string names");

    dir.close();   
    
};

exports["test: layers"] = function() {

    var dir = new WORKSPACE.Directory(dataDir);    
    var layers = dir.layers;
    ASSERT.ok(layers instanceof Array, "got layers array");
    ASSERT.equal(layers.length, 1, "one layer in workspace");
    ASSERT.ok(layers[0] instanceof LAYER.Layer, "first element is layer");

    dir.close();   
    
};

exports["test: get"] = function() {

    var dir = new WORKSPACE.Directory(dataDir);
    var l = dir.get(dir.names[0]);
    
    ASSERT.ok(l instanceof LAYER.Layer, "get returns a layer instance");
    
    ASSERT.equal(dir.get("foo"), undefined, "getting invalid name returns undefined");

    dir.close();   
    
};

if (require.main == module.id) {
    require("test").run(exports);
}

