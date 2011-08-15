var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Expression = require("geoscript/filter").Expression;

exports["test: constructor"] = function() {
    
    var color = new STYLE.Color();
    
    ASSERT.ok(color instanceof STYLE.Brush, "is Brush");
    ASSERT.ok(color instanceof STYLE.Color, "is Color");
    
};

exports["test: value"] = function() {
    
    var color;
    
    // named color as config
    color = new STYLE.Color("blue");
    ASSERT.strictEqual(color.value.text, "'#0000ff'", "string config with named color");
    
    // hex value as config
    color = new STYLE.Color("#bada55");
    ASSERT.strictEqual(color.value.text, "'#bada55'", "string config with hex value");

    // rgb array as config
    color = new STYLE.Color([255, 0, 0]);
    ASSERT.strictEqual(color.value.text, "'#ff0000'", "rgb array config");

    // config with named color
    color = new STYLE.Color({value: "lime"});
    ASSERT.strictEqual(color.value.text, "'#00ff00'", "named color value");

    // config with hex value
    color = new STYLE.Color({value: "#abcabc"});
    ASSERT.strictEqual(color.value.text, "'#abcabc'", "hex value");

    // config with hex value
    color = new STYLE.Color({value: [0, 255, 0]});
    ASSERT.strictEqual(color.value.text, "'#00ff00'", "rgb array value");
    
    color = new STYLE.Color();
    
    // set value with named color
    color.value = "yellow";
    ASSERT.strictEqual(color.value.text, "'#ffff00'", "named color");
    
    color.value = "#bada55";
    ASSERT.strictEqual(color.value.text, "'#bada55'", "hex value");
    
    color.value = [0, 255, 187];
    ASSERT.strictEqual(color.value.text, "'#00ffbb'", "rgb array");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
