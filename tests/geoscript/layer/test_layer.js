var assert = require("test/assert");
var Layer = require("geoscript/layer").Layer;
var geom = require("geoscript/geom");

exports["test: constructor"] = function() {

    var l = new Layer();
    assert.isTrue(l instanceof Layer, "instanceof Layer");

};

exports["test: temporary"] = function() {
    
    var temp = new Layer({});
    assert.isTrue(temp.temporary);
    
    var file = require("file");
    var path = file.resolve(module.path, "../../data");
    
    var shp = new Layer({
        workspace: path,
        name: "states"
    });
    assert.isFalse(shp.temporary);

    
};

exports["test: clone"] = function() {

    var clone;
    var temp = new Layer({name: "foo"});

    // create a clone without providing a name
    clone = temp.clone();
    assert.isTrue(clone instanceof Layer, "clone is a Layer");
    assert.isTrue(typeof clone.name === "string", "clone has a name");
    assert.isTrue(clone.name !== temp.name, "clone gets a new name");
    
    // create a clone with a new name
    clone = temp.clone("bar");
    assert.is("bar", clone.name, "clone can be given a new name");
    
    // clone an existing layer with features
    var file = require("file");
    var path = file.resolve(module.path, "../../data");
    
    var shp = new Layer({
        workspace: path,
        name: "states"
    });
    
    clone = shp.clone();
    assert.isTrue(clone.temporary, "clone is a temporary layer");
    assert.is(shp.count, clone.count, "clone has same count as original");

};