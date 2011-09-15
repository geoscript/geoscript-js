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

exports["test: add"] = function() {

    var dir = new WORKSPACE.Directory(dataDir);
    var states = dir.get("states");
    
    ASSERT.throws(function() {
        dir.add(states);
    }, Error, "add with same name");
    
    var states2 = dir.add(states, {name: "states2"});
    ASSERT.equal(dir.names.length, 2, "two layers");
    ASSERT.equal(states2.count, 49, "two count");
    
    var states3 = dir.add(states, {name: "states3", filter: "STATE_ABBR like 'M%'"});
    ASSERT.equal(dir.names.length, 3, "three layers");
    ASSERT.equal(states3.count, 8, "three count");

    var states4 = dir.add(states, {name: "states4", projection: "epsg:32002"});
    ASSERT.equal(dir.names.length, 4, "four layers");
    ASSERT.equal(states4.count, 49, "four count");
    ASSERT.equal(states4.projection.id, "EPSG:32002", "four projection");

};



if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

