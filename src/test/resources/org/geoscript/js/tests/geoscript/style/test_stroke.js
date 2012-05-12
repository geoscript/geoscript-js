var ASSERT = require("assert");
var Symbolizer = require("geoscript/style").Symbolizer;
var Stroke = require("geoscript/style").Stroke;

exports["test: constructor"] = function() {
    
    var stroke = new Stroke({});
    
    ASSERT.ok(stroke instanceof Symbolizer, "is Symbolizer");
    ASSERT.ok(stroke instanceof Stroke, "is Stroke");

};

exports["test: opacity"] = function() {
    
    var symbolizer;
    
    // opacity in config
    symbolizer = new Stroke({opacity: 0.5});
    ASSERT.strictEqual(symbolizer.opacity.text, "0.5", "opacity in config");
    
    symbolizer.opacity = 0.75;
    ASSERT.strictEqual(symbolizer.opacity.text, "0.75", "opacity setter");

    ASSERT.throws(function() {
        symbolizer.opacity = 1.5;
    }, Error, "opacity greater than 1");

    ASSERT.throws(function() {
        symbolizer.opacity = -2;
    }, Error, "opacity less than 0");

    ASSERT.throws(function() {
        symbolizer.opacity = "foo";
    }, Error, "bogus opacity");
    
};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
