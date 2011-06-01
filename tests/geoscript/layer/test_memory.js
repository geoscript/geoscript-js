var ASSERT = require("assert");
var LAYER = require("geoscript/layer");
var GEOM = require("geoscript/geom");


exports["test: Layer.temporary"] = function() {
    
    var temp = new LAYER.Layer({});
    ASSERT.ok(temp.temporary);
    
};

exports["test: add"] = function() {
    
    var p = new GEOM.Point([1, 2]);
    var mem = new LAYER.Layer({});
    mem.add({geom: p});
    
    ASSERT.strictEqual(mem.count, 1, "one item added");
    
    var f = mem.features.next();
    
    ASSERT.ok(p.equalsExact(f.geometry), "first feature has correct geometry");
    
};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

