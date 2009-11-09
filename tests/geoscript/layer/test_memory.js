var assert = require("test/assert");
var layer = require("geoscript/layer");
var geom = require("geoscript/geom");

exports["test: MemoryLayer.constructor"] = function() {

    var mem = new layer.MemoryLayer();
    
    assert.isTrue(mem instanceof layer.Layer, "instanceof Layer");
    assert.isTrue(mem instanceof layer.MemoryLayer, "instanceof MemoryLayer");    

};

exports["test: MemoryLayer.add"] = function() {
    
    var p = new geom.Point([1, 2]);
    var mem = new layer.MemoryLayer();
    mem.add({geom: p});
    
    assert.is(1, mem.count, "one item added");
    
    var f = mem.features().next();
    
    assert.isTrue(p.equalsExact(f.geometry), "first feature has correct geometry");
    
};


if (require.main === module.id) {
    require("test/runner").run(exports);
}


