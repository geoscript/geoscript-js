var ASSERT = require("assert");
var LAYER = require("geoscript/layer");


exports["test: Layer.temporary"] = function() {

    var temp = new LAYER.Layer({fields: [{name: "foo", type: "String"}]});
    ASSERT.ok(temp.temporary);
    
};

exports["test: add"] = function() {
    
    var mem = new LAYER.Layer({fields: [{name: "foo", type: "String"}]});
    mem.add({foo: "bar"});
    
    ASSERT.strictEqual(mem.count, 1, "one item added");
    
    var f = mem.features.get(1)[0];
    
    ASSERT.strictEqual(f.get("foo"), "bar");
    
};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

