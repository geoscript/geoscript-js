
var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var point = new STYLE.PointSymbolizer({});
    
    ASSERT.ok(point instanceof STYLE.Symbolizer, "PointSymbolizer is a Symbolizer");
    ASSERT.ok(point instanceof STYLE.PointSymbolizer, "PointSymbolizer is a PointSymbolizer");

    var point = new STYLE.PointSymbolizer({
        shape: "circle",
        strokeColor: "#ff00ff",
        fillOpacity: 0.7
    });
    ASSERT.strictEqual(point.shape, "circle", "shape properly set");
    ASSERT.strictEqual(point.strokeColor, "#ff00ff", "stroke color properly set");
    ASSERT.strictEqual(point.fillOpacity, 0.7, "fill opacity properly set");
    
};

exports["test: shape"] = function() {
    
    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.shape, "square", "square mark by default");
    
    point.shape = "star";
    ASSERT.strictEqual(point.shape, "star", "shape properly set");
    
};

exports["test: strokeColor"] = function() {
    
    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.strokeColor, "#000000", "stroke color black by default");

    point.strokeColor = "#ff0000";
    ASSERT.strictEqual(point.strokeColor, "#ff0000", "stroke color properly set");
    
};

exports["test: strokeColor"] = function() {

    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.strokeWidth, 1, "stroke width 1 by default");

    point.strokeWidth = 3;
    ASSERT.strictEqual(point.strokeWidth, 3, "stroke width properly set");

};

exports["test: strokeColor"] = function() {

    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.strokeOpacity, 1, "stroke opacity 1 by default");

    point.strokeOpacity = 0.8;    
    ASSERT.strictEqual(point.strokeOpacity, 0.8, "stroke opacity properly set");
    
};

exports["test: fillColor"] = function() {
    
    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.fillColor, "#808080", "fill color gray by default");

    point.fillColor = "#00FF00";
    ASSERT.strictEqual(point.fillColor, "#00FF00", "fill color properly set");

};

exports["test: fillOpacity"] = function() {

    var point = new STYLE.PointSymbolizer({});
    ASSERT.strictEqual(point.fillOpacity, 1, "fill opcity 1 by default");

    point.fillOpacity = 0.8;    
    ASSERT.strictEqual(point.fillOpacity, 0.8, "fill opacity properly set");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
