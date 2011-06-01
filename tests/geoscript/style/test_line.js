
var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var symbolizer = new STYLE.LineSymbolizer({});
    
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "symbolizer is a Symbolizer");
    ASSERT.ok(symbolizer instanceof STYLE.LineSymbolizer, "symbolizer is a LineSymbolizer");

    var symbolizer = new STYLE.LineSymbolizer({
        strokeColor: "#ff00ff",
        strokeLineCap: "round"
    });
    ASSERT.strictEqual(symbolizer.strokeColor, "#ff00ff", "stroke color properly set");
    ASSERT.strictEqual(symbolizer.strokeLineCap, "round", "stroke line cap properly set");
    
};

exports["test: strokeColor"] = function() {
    
    var symbolizer = new STYLE.LineSymbolizer({});
    ASSERT.strictEqual(symbolizer.strokeColor, "#000000", "stroke color black by default");

    symbolizer.strokeColor = "#ff0000";
    ASSERT.strictEqual(symbolizer.strokeColor, "#ff0000", "stroke color properly set");

    symbolizer.strokeColor = "silver";
    ASSERT.strictEqual(symbolizer.strokeColor, "#c0c0c0", "stroke color properly set with color name");
    
};

exports["test: strokeWidth"] = function() {

    var symbolizer = new STYLE.LineSymbolizer({});

    ASSERT.strictEqual(symbolizer.strokeWidth, 1, "stroke width 1 by default");
    symbolizer.strokeWidth = 3;
    ASSERT.strictEqual(symbolizer.strokeWidth, 3, "stroke width properly set");

};

exports["test: strokeOpacity"] = function() {

    var symbolizer = new STYLE.LineSymbolizer({});

    ASSERT.strictEqual(symbolizer.strokeOpacity, 1, "stroke opacity 1 by default");
    symbolizer.strokeOpacity = 0.8;    
    ASSERT.strictEqual(symbolizer.strokeOpacity, 0.8, "stroke opacity properly set");
    
};

exports["test: strokeLineCap"] = function() {

    var symbolizer = new STYLE.LineSymbolizer({});

    ASSERT.strictEqual(symbolizer.strokeLineCap, "butt", "stroke line cap butt by default");
    symbolizer.strokeLineCap = "round";
    ASSERT.strictEqual(symbolizer.strokeLineCap, "round", "stroke line cap properly set");
    
};

exports["test: strokeDashArray"] = function() {

    var symbolizer = new STYLE.LineSymbolizer({});

    ASSERT.strictEqual(symbolizer.strokeDashArray, null, "stroke dash array null by default");
    symbolizer.strokeDashArray = [5, 3, 2, 1];
    ASSERT.deepEqual(symbolizer.strokeDashArray, [5, 3, 2, 1], "stroke dash array properly set");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
