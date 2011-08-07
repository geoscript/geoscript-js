var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var color = new STYLE.Color();
    
    ASSERT.ok(color instanceof STYLE.Brush, "is Brush");
    ASSERT.ok(color instanceof STYLE.Color, "is Color");

};

exports["test: value"] = function() {
    
    var color;
    
    // named color as config
    color = new STYLE.Color("blue");
    ASSERT.strictEqual(color.value, "#0000ff", "string config with named color");
    
    // hex value as config
    color = new STYLE.Color("#bada55");
    ASSERT.strictEqual(color.value, "#bada55", "string config with hex value");

    // rgb array as config
    color = new STYLE.Color([255, 0, 0]);
    ASSERT.strictEqual(color.value, "#ff0000", "rgb array config");

    // config with named color
    color = new STYLE.Color({value: "lime"});
    ASSERT.strictEqual(color.value, "#00ff00", "named color value");

    // config with hex value
    color = new STYLE.Color({value: "#abcabc"});
    ASSERT.strictEqual(color.value, "#abcabc", "hex value");

    // config with hex value
    color = new STYLE.Color({value: [0, 255, 0]});
    ASSERT.strictEqual(color.value, "#00ff00", "rgb array value");
    
    color = new STYLE.Color();
    
    // set value with named color
    color.value = "yellow";
    ASSERT.strictEqual(color.value, "#ffff00", "named color");
    
    color.value = "#bada55";
    ASSERT.strictEqual(color.value, "#bada55", "hex value");
    
    color.value = [0, 255, 187];
    ASSERT.strictEqual(color.value, "#00ffbb", "rgb array");
    
};

exports["test: opacity"] = function() {
    
    var color;
    
    // opacity in config
    color = new STYLE.Color({value: "white", opacity: 0.5});
    ASSERT.strictEqual(color.opacity, 0.5, "opacity in config");
    ASSERT.strictEqual(color.value, "#ffffff", "correct color");
    
    color.opacity = 0.75;
    ASSERT.strictEqual(color.opacity, 0.75, "opacity in config");

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
