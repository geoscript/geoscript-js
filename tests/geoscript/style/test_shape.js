var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Expression = require("geoscript/filter").Expression;

exports["test: constructor"] = function() {
    
    var shape = new STYLE.Shape();
    
    ASSERT.ok(shape instanceof STYLE.Brush, "is Brush");
    ASSERT.ok(shape instanceof STYLE.Shape, "is Shape");
    
    ASSERT.ok(shape.name instanceof Expression, "name expression");
    ASSERT.strictEqual(shape.name.text, "'circle'", "default name");

    ASSERT.ok(shape.size instanceof Expression, "size expression");
    ASSERT.strictEqual(shape.size.text, "6", "default size");

};

exports["test: name"] = function() {
    
    var shape;
    
    // named color as config
    shape = new STYLE.Shape("square");
    ASSERT.ok(shape.name instanceof Expression, "name is expression");
    ASSERT.strictEqual(shape.name.text, "'square'", "string config with named shape");
    
    // config with named color
    shape = new STYLE.Shape({name: "cross"});
    ASSERT.ok(shape.name instanceof Expression, "name is expression");
    ASSERT.strictEqual(shape.name.text, "'cross'", "named shape");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
