//exports["test: MemoryLayer"] = require("./layer/test_memory");
//exports["test: Shapefile"] = require("./layer/test_shapefile");

var assert = require("test/assert");
var layer = require("geoscript/layer");
var geom = require("geoscript/geom");

exports["test: Layer.constructor"] = function() {

    var l = new layer.Layer();
    assert.isTrue(l instanceof layer.Layer, "instanceof layer.Layer");

};

exports["test: Layer.temporary"] = function() {
    
    var temp = new layer.Layer({});
    assert.isTrue(temp.temporary);
    
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var shp = new layer.Layer({
        workspace: path,
        name: "states"
    });
    assert.isFalse(shp.temporary);

    
};

exports["test: Layer.clone"] = function() {

    var clone;
    var temp = new layer.Layer({name: "foo"});

    // create a clone without providing a name
    clone = temp.clone();
    assert.isTrue(clone instanceof layer.Layer, "clone is a layer.Layer");
    assert.isTrue(typeof clone.name === "string", "clone has a name");
    assert.isTrue(clone.name !== temp.name, "clone gets a new name");
    
    // create a clone with a new name
    clone = temp.clone("bar");
    assert.is("bar", clone.name, "clone can be given a new name");
    
    // clone an existing layer with features
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var shp = new layer.Layer({
        workspace: path,
        name: "states"
    });
    
    clone = shp.clone();
    assert.isTrue(clone.temporary, "clone is a temporary layer");
    assert.is(shp.count, clone.count, "clone has same count as original");

};

exports["test: create(shapefile)"] = function() {
    
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var shp = layer.create({
        workspace: path,
        name: "states"
    });
    
    assert.isTrue(shp instanceof layer.Layer, "instanceof layer.Layer");
    assert.is(49, shp.count, "49 features");
    
};

exports["test: create(memory)"] = function() {
    
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var mem = layer.create({});
    
    assert.isTrue(mem instanceof layer.Layer, "instanceof layer.Layer");
    assert.isTrue(mem.temporary, "temporary layer");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
