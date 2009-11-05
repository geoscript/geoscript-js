var assert = require("test/assert");
var layer = require("geoscript/layer");
var geom = require("geoscript/geom");

exports["test: MemoryLayer"] = function() {

    var mem = new layer.MemoryLayer();
    
    assert.isTrue(mem instanceof layer.Layer, "instanceof Layer");
    assert.isTrue(mem instanceof layer.MemoryLayer, "instanceof MemoryLayer");    

};

exports["test: MemoryLayer.add"] = function() {
    
    var p = new geom.Point([1, 2]);
    var mem = new layer.MemoryLayer();
    mem.add({geom: p});
    
    assert.isEqual(1, mem.count(), "one item added");
    
    var f = mem.features()[0];
    
    assert.isSame(p.coordinates, f.getGeometry().coordinates, "first feature has correct geometry");
    
};


if (require.main === module.id) {
    require("test/runner").run(exports);
}


