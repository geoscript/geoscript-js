
var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var symbolizer = new STYLE.PointSymbolizer({});
    
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "PointSymbolizer is a Symbolizer");
    ASSERT.ok(symbolizer instanceof STYLE.PointSymbolizer, "PointSymbolizer is a PointSymbolizer");

    var symbolizer = new STYLE.PointSymbolizer({
        shape: "circle",
        strokeColor: "#ff00ff",
        fillOpacity: 0.7
    });
    ASSERT.strictEqual(symbolizer.shape, "circle", "shape properly set");
    ASSERT.strictEqual(symbolizer.strokeColor, "#ff00ff", "stroke color properly set");
    ASSERT.strictEqual(symbolizer.fillOpacity, 0.7, "fill opacity properly set");
    
};

exports["test: strokeColor"] = function() {
    
    var symbolizer = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(symbolizer.strokeColor, "#000000", "stroke color black by default");

    symbolizer.strokeColor = "#ff0000";
    ASSERT.strictEqual(symbolizer.strokeColor, "#ff0000", "stroke color properly set");

    symbolizer.strokeColor = "yellow";
    ASSERT.strictEqual(symbolizer.strokeColor, "#ffff00", "stroke color properly set with color name");
    
};

exports["test: strokeWidth"] = function() {

    var symbolizer = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(symbolizer.strokeWidth, 1, "stroke width 1 by default");

    symbolizer.strokeWidth = 3;
    ASSERT.strictEqual(symbolizer.strokeWidth, 3, "stroke width properly set");

};

exports["test: strokeOpacity"] = function() {

    var symbolizer = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(symbolizer.strokeOpacity, 1, "stroke opacity 1 by default");

    symbolizer.strokeOpacity = 0.8;    
    ASSERT.strictEqual(symbolizer.strokeOpacity, 0.8, "stroke opacity properly set");
    
};

exports["test: fillColor"] = function() {
    
    var symbolizer = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(symbolizer.fillColor, "#808080", "fill color gray by default");

    symbolizer.fillColor = "#00FF00";
    ASSERT.strictEqual(symbolizer.fillColor, "#00ff00", "fill color properly set");

    symbolizer.fillColor = "green";
    ASSERT.strictEqual(symbolizer.fillColor, "#008000", "fill color properly set with color name");

};

exports["test: fillOpacity"] = function() {

    var symbolizer = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(symbolizer.fillOpacity, 1, "fill opcity 1 by default");

    symbolizer.fillOpacity = 0.8;    
    ASSERT.strictEqual(symbolizer.fillOpacity, 0.8, "fill opacity properly set");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
