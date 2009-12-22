var assert = require("test/assert");
var Layer = require("geoscript/layer").Layer;
var geom = require("geoscript/geom");

exports["test: constructor"] = function() {

    var l = new Layer();
    assert.isTrue(l instanceof Layer, "instanceof Layer");

};

exports["test: temporary"] = function() {
    
    var temp = new Layer({name: "foo"});
    assert.isTrue(temp.temporary);
    
    var file = require("file");
    var path = file.resolve(module.path, "../../data");
    
    var shp = new Layer({
        workspace: path,
        name: "states"
    });
    assert.isFalse(shp.temporary);

    
};
