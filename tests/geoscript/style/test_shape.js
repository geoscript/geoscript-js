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

exports["test: opacity"] = function() {
    
    var color;
    
    color = new STYLE.Color("blue");
    ASSERT.strictEqual(color.value.text, "'#0000ff'", "correct color");
    ASSERT.strictEqual(color.opacity.text, "1", "default opacity")
    
    // opacity in config
    color = new STYLE.Color({value: "white", opacity: 0.5});
    ASSERT.strictEqual(color.opacity.text, "0.5", "opacity in config");
    ASSERT.strictEqual(color.value.text, "'#ffffff'", "correct color");
    
    color.opacity = 0.75;
    ASSERT.strictEqual(color.opacity.text, "0.75", "opacity in config");

    ASSERT.throws(function() {
        color.opacity = 1.5;
    }, Error, "opacity greater than 1");

    ASSERT.throws(function() {
        color.opacity = -2;
    }, Error, "opacity less than 0");

    ASSERT.throws(function() {
        color.opacity = "foo";
    }, Error, "bogus opacity");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
