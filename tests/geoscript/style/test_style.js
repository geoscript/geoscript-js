var ASSERT = require("assert");
var STYLE = require("geoscript/style");

var geotools = Packages.org.geotools;

exports["test: _style (simple)"] = function() {
    
    // simple style with one rule and two symbolizers
    var style = new STYLE.Style({
        rules: [{
            symbolizers: [{
                shape: "circle",
                size: 12,
                fillColor: "#ff0000"
            }, {
                shape: "star",
                size: 11,
                fillColor: "#ffffff"
            }]
        }]
    });
    
    var _style = style._style;
    ASSERT.ok(_style instanceof geotools.styling.Style, "_style instanceof geotools Style");
    
    var featureTypeStyles = _style.featureTypeStyles();
    ASSERT.equal(featureTypeStyles.size(), 1, "one feature type style");
    
    var rules = featureTypeStyles.get(0).getRules();
    ASSERT.equal(rules.length, 1, "one rule");

    var rule = rules[0];
    ASSERT.ok(rule instanceof geotools.styling.Rule, "rule is correct type");
    
    var symbolizers = rule.getSymbolizers();
    ASSERT.equal(symbolizers.length, 2, "two symbolizers");
    
    var symbolizer = symbolizers[0];
    ASSERT.ok(symbolizer instanceof geotools.styling.PointSymbolizerImpl, "correct symbolizer type for first symbolizer");
    
    var graphic = symbolizer.getGraphic();
    ASSERT.ok(graphic instanceof geotools.styling.GraphicImpl, "correct graphic type for first symbolizer");
    ASSERT.equal(graphic.getSymbols()[0].getWellKnownName(), "circle", "correct graphic name for first symbolizer");
    ASSERT.equal(graphic.getSize(), 12, "correct graphic size for first symbolizer")
    ASSERT.equal(graphic.getSymbols()[0].getFill().getColor(), "#ff0000", "correct fill color for first symbolizer")

    var symbolizer = symbolizers[1];
    ASSERT.ok(symbolizer instanceof geotools.styling.PointSymbolizerImpl, "correct symbolizer type for second symbolizer");
    
    var graphic = symbolizer.getGraphic();
    ASSERT.ok(graphic instanceof geotools.styling.GraphicImpl, "correct graphic type for second symbolizer");
    ASSERT.equal(graphic.getSymbols()[0].getWellKnownName(), "star", "correct graphic name for second symbolizer");
    ASSERT.equal(graphic.getSize(), 11, "correct graphic size for second symbolizer")
    ASSERT.equal(graphic.getSymbols()[0].getFill().getColor(), "#ffffff", "correct fill color for second symbolizer")
    
};

exports["test: _style (multiple featureTypeStyle)"] = function() {
    
    // style with one rule and two symbolizers with different zIndex
    var style = new STYLE.Style({
        rules: [{
            symbolizers: [{
                zIndex: 0,
                type: "LineSymbolizer",
                strokeWidth: 5,
                strokeColor: "#ffff00"
            }, {
                zIndex: 1,
                type: "LineSymbolizer",
                strokeWidth: 3,
                strokeColor: "#ff0000"
            }]
        }]
    });    
    
    var _style = style._style;
    ASSERT.ok(_style instanceof geotools.styling.Style, "_style instanceof geotools Style");
    
    var featureTypeStyles = _style.featureTypeStyles();
    ASSERT.equal(featureTypeStyles.size(), 2, "two feature type styles");
    
    var rules = featureTypeStyles.get(0).getRules();
    ASSERT.equal(rules.length, 1, "one rule in first feature type style");

    var rule = rules[0];
    ASSERT.ok(rule instanceof geotools.styling.Rule, "rule is correct type in first feature type style");
    
    var symbolizers = rule.getSymbolizers();
    ASSERT.equal(symbolizers.length, 1, "one symbolizer in first feature type style");
    
    var symbolizer = symbolizers[0];
    ASSERT.ok(symbolizer instanceof geotools.styling.LineSymbolizerImpl, "correct symbolizer type for first symbolizer in first feature type style");
    
    var stroke = symbolizer.getStroke();
    ASSERT.ok(stroke instanceof geotools.styling.StrokeImpl, "correct stroke type for first symbolizer in first feature type style");
    ASSERT.equal(stroke.getWidth(), 5, "correct stroke width for first symbolizer in first feature type style");
    ASSERT.equal(stroke.getColor(), "#ffff00", "correct stroke color for first symbolizer in first feature type style")
    
    var rules = featureTypeStyles.get(1).getRules();
    ASSERT.equal(rules.length, 1, "one rule in second feature type style");

    var rule = rules[0];
    ASSERT.ok(rule instanceof geotools.styling.Rule, "rule is correct type in second feature type style");
    
    var symbolizers = rule.getSymbolizers();
    ASSERT.equal(symbolizers.length, 1, "one symbolizer in second feature type style");
    
    var symbolizer = symbolizers[0];
    ASSERT.ok(symbolizer instanceof geotools.styling.LineSymbolizerImpl, "correct symbolizer type for second symbolizer in first feature type style");
    
    var stroke = symbolizer.getStroke();
    ASSERT.ok(stroke instanceof geotools.styling.StrokeImpl, "correct stroke type for first symbolizer in second feature type style");
    ASSERT.equal(stroke.getWidth(), 3, "correct stroke width for first symbolizer in second feature type style");
    ASSERT.equal(stroke.getColor(), "#ff0000", "correct stroke color for first symbolizer in second feature type style")

};

if (require.main == module.id) {
    require("test").run(exports);
}
