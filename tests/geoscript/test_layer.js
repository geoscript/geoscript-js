var assert = require("test/assert");
var Layer = require("geoscript/layer").Layer;
var MemoryLayer = require("geoscript/layer").MemoryLayer;

exports["test: MemoryLayer"] = function() {

    var mem = new MemoryLayer();
    
    assert.isTrue(mem instanceof Layer, "instanceof Layer");
    assert.isTrue(mem instanceof MemoryLayer, "instanceof MemoryLayer");

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}


