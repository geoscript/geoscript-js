var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Expression = require("geoscript/filter").Expression;

exports["test: constructor"] = function() {
    
    var shape = new STYLE.Shape();
    
    ASSERT.ok(shape instanceof STYLE.Symbolizer, "is Symbolizer");
    ASSERT.ok(shape instanceof STYLE.Shape, "is Shape");
    
    ASSERT.ok(shape.name instanceof Expression, "name expression");
    ASSERT.strictEqual(shape.name.text, "'square'", "default name");

    ASSERT.ok(shape.size instanceof Expression, "size expression");
    ASSERT.strictEqual(shape.size.text, "6", "default size");

};

exports["test: name"] = function() {
    
    var shape;
    
    // named color as config
    shape = new STYLE.Shape("circle");
    ASSERT.ok(shape.name instanceof Expression, "name is expression");
    ASSERT.ok(shape.name.literal, "name is literal expression");
    ASSERT.strictEqual(shape.name.text, "'circle'", "string config with named shape");
    
    // config with named color
    shape = new STYLE.Shape({name: "cross"});
    ASSERT.ok(shape.name instanceof Expression, "name is expression");
    ASSERT.ok(shape.name.literal, "name is literal expression");
    ASSERT.strictEqual(shape.name.text, "'cross'", "named shape");

    // expression for name
    shape = new STYLE.Shape();
    shape.name = new Expression("foo");
    ASSERT.ok(shape.name instanceof Expression, "name is expression");
    ASSERT.ok(!shape.name.literal, "name is not literal expression");
    ASSERT.strictEqual(shape.name.text, "foo", "name from expression");

};

exports["test: opacity"] = function() {
    
    var shape;
    
    // opacity in config
    shape = new STYLE.Shape({opacity: 0.5});
    ASSERT.ok(shape.opacity instanceof Expression, "opacity is expression");
    ASSERT.ok(shape.opacity.literal, "opacity is literal expression");
    ASSERT.strictEqual(shape.opacity.text, "0.5", "correct opacity");

    // literal for opacity
    shape = new STYLE.Shape();
    shape.opacity = 0.75;
    ASSERT.ok(shape.opacity instanceof Expression, "opacity is expression");
    ASSERT.ok(shape.opacity.literal, "opacity is literal expression");
    ASSERT.strictEqual(shape.opacity.text, "0.75", "opacity from expression");
    
    // expression for opacity
    shape = new STYLE.Shape();
    shape.opacity = new Expression("foo");
    ASSERT.ok(shape.opacity instanceof Expression, "opacity is expression");
    ASSERT.ok(!shape.opacity.literal, "opacity is not literal expression");
    ASSERT.strictEqual(shape.opacity.text, "foo", "opacity from expression");

};

exports["test: size"] = function() {
    
    var shape;
    
    // size in config
    shape = new STYLE.Shape({size: 3});
    ASSERT.ok(shape.size instanceof Expression, "size is expression");
    ASSERT.ok(shape.size.literal, "size is literal expression");
    ASSERT.strictEqual(shape.size.text, "3", "correct opacity");

    // literal for size
    shape = new STYLE.Shape();
    shape.size = 7;
    ASSERT.ok(shape.size instanceof Expression, "size is expression");
    ASSERT.ok(shape.size.literal, "size is literal expression");
    ASSERT.strictEqual(shape.size.text, "7", "size from expression");
    
    // expression for size
    shape = new STYLE.Shape();
    shape.size = new Expression("foo");
    ASSERT.ok(shape.size instanceof Expression, "size is expression");
    ASSERT.ok(!shape.size.literal, "size is not literal expression");
    ASSERT.strictEqual(shape.size.text, "foo", "size from expression");

};

exports["test: rotation"] = function() {
    
    var shape;
    
    // rotation in config
    shape = new STYLE.Shape({rotation: 30});
    ASSERT.ok(shape.rotation instanceof Expression, "rotation is expression");
    ASSERT.ok(shape.rotation.literal, "rotation is literal expression");
    ASSERT.strictEqual(shape.rotation.text, "30", "correct rotation");

    // literal for rotation
    shape = new STYLE.Shape();
    shape.rotation = 90;
    ASSERT.ok(shape.rotation instanceof Expression, "rotation is expression");
    ASSERT.ok(shape.rotation.literal, "rotation is literal expression");
    ASSERT.strictEqual(shape.rotation.text, "90", "rotation from expression");
    
    // expression for rotation
    shape = new STYLE.Shape();
    shape.rotation = new Expression("foo");
    ASSERT.ok(shape.rotation instanceof Expression, "rotation is expression");
    ASSERT.ok(!shape.rotation.literal, "rotation is not literal expression");
    ASSERT.strictEqual(shape.rotation.text, "foo", "rotation from expression");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
