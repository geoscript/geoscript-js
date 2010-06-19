var assert = require("assert");
var layer = require("geoscript/layer");
var geom = require("geoscript/geom");


exports["test: Layer.temporary"] = function() {
    
    var temp = new layer.Layer({});
    assert.ok(temp.temporary);
    
};

exports["test: add"] = function() {
    
    var p = new geom.Point([1, 2]);
    var mem = new layer.Layer({});
    mem.add({geom: p});
    
    assert.strictEqual(mem.count, 1, "one item added");
    
    var f = mem.features.next();
    
    assert.ok(p.equalsExact(f.geometry), "first feature has correct geometry");
    
};


if (require.main == module.id) {
    require("test").run(exports);
}

