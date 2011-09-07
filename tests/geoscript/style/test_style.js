var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Filter = require("geoscript/filter").Filter;

var geotools = Packages.org.geotools;

exports["test: constructor"] = function() {
    
    var style = new STYLE.Style();
    
    ASSERT.ok(style instanceof STYLE.Symbolizer, "is Symbolizer");
    ASSERT.ok(style instanceof STYLE.Style, "is Style");

    style = new STYLE.Style({
        parts: [{
            type: "Fill",
            brush: "#ff0000",
            maxScaleDenominator: 100000
        }, {
            type: "Stroke",
            brush: "#ffff00",
            minScaleDenominator: 100000
        }]
    });
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.parts.length, 2, "parts length 2");

    var symbolizer = style.parts[0];
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "part 0 Symbolizer");
    ASSERT.ok(symbolizer instanceof STYLE.Fill, "part 0 Fill");
    ASSERT.equal(symbolizer.maxScaleDenominator, 100000, "part 0 max scale denominator");
    ASSERT.equal(symbolizer.brush.hex, "ff0000", "part 0 fill color");

    symbolizer = style.parts[1];
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "part 1 Symbolizer");
    ASSERT.ok(symbolizer instanceof STYLE.Stroke, "part 1 Stroke");
    ASSERT.equal(symbolizer.minScaleDenominator, 100000, "part 1  min scale denominator");
    ASSERT.equal(symbolizer.brush.hex, "ffff00", "part 1 fill color");

};

exports["test: and"] = function() {
    
    var s1 = new STYLE.Symbolizer({});
    var s2 = new STYLE.Symbolizer({});
    var s3 = new STYLE.Symbolizer({});
    
    var style = s1.and(s2);
    ASSERT.ok(style instanceof STYLE.Style, "is Style");
    
    var o = style.and(s3);
    
    ASSERT.ok(o === style, "returns self");
    
    ASSERT.strictEqual(style.parts.length, 3, "style has three parts");
    ASSERT.ok(style.parts[0] === s1, "first part");
    ASSERT.ok(style.parts[1] === s2, "second part");
    ASSERT.ok(style.parts[2] === s3, "third part");

};

exports["test: constructor (symbolizer instance)"] = function() {
    
    var style = new STYLE.Style(new STYLE.Stroke("#ff0000"));
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    var symbolizer = style.parts[0];
    ASSERT.ok(symbolizer instanceof STYLE.Stroke, "Stroke symbolizer");
    ASSERT.equal(symbolizer.brush.hex, "ff0000", "stroke color");

};

exports["test: constructor (array of symbolizer config)"] = function() {

    var style = new STYLE.Style([{
        type: "Fill",
        brush: "#ff0000"
    }, {
        type: "Stroke",
        brush: "#ffff00"
    }]);
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.parts.length, 2, "parts length 2");
    var symbolizer = style.parts[0];
    ASSERT.ok(symbolizer instanceof STYLE.Fill, "Fill symbolizer");
    ASSERT.equal(symbolizer.brush.hex, "ff0000", "fill color");
    symbolizer = style.parts[1];
    ASSERT.ok(symbolizer instanceof STYLE.Stroke, "Stroke symbolizer");
    ASSERT.equal(symbolizer.brush.hex, "ffff00", "stroke color");

};

exports["test: _style (simple)"] = function() {
    
    // simple style with two symbolizers
    var style = new STYLE.Style({
        parts: [{
            type: "Shape",
            name: "circle",
            size: 12,
            fill: "#ff0000"
        }, {
            type: "Shape",
            name: "star",
            size: 11,
            fill: "#ffffff"
        }]
    });
    
    var _style = style._style;
    ASSERT.ok(_style instanceof geotools.styling.Style, "_style instanceof geotools Style");
    
    var featureTypeStyles = _style.featureTypeStyles();
    ASSERT.equal(featureTypeStyles.size(), 1, "one feature type style");
    
    var rules = featureTypeStyles.get(0).getRules();
    ASSERT.equal(rules.length, 2, "two rules");

    var rule = rules[0];
    ASSERT.ok(rule instanceof geotools.styling.Rule, "rule is correct type");
    
    var symbolizers = rule.getSymbolizers();
    ASSERT.equal(symbolizers.length, 1, "one symbolizer");
    
    var symbolizer = symbolizers[0];
    ASSERT.ok(symbolizer instanceof geotools.styling.PointSymbolizerImpl, "correct symbolizer type for first symbolizer");
    
    var graphic = symbolizer.getGraphic();
    ASSERT.ok(graphic instanceof geotools.styling.GraphicImpl, "correct graphic type for first symbolizer");
    ASSERT.equal(graphic.getSymbols()[0].getWellKnownName(), "circle", "correct graphic name for first symbolizer");
    ASSERT.equal(graphic.getSize(), 12, "correct graphic size for first symbolizer")
    ASSERT.equal(graphic.getSymbols()[0].getFill().getColor(), "#ff0000", "correct fill color for first symbolizer")

    var rule = rules[1];
    ASSERT.ok(rule instanceof geotools.styling.Rule, "rule is correct type");
    
    var symbolizers = rule.getSymbolizers();
    ASSERT.equal(symbolizers.length, 1, "one symbolizer");

    var symbolizer = symbolizers[0];
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
        parts: [{
            type: "Stroke",
            filter: "value = 'foo'",
            maxScaleDenominator: 200000,
            minScaleDenominator: 100000,
            zIndex: 0,
            width: 5,
            brush: "#ffff00"
        }, {
            type: "Stroke",
            zIndex: 1,
            width: 3,
            brush: "#ff0000"
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
    ASSERT.equal(rule.getMinScaleDenominator(), 100000, "first rule has correct min scale denominator");
    ASSERT.equal(rule.getMaxScaleDenominator(), 200000, "first rule has correct max scale denominator");
    ASSERT.ok(rule.getFilter() instanceof geotools.filter.IsEqualsToImpl, "first rule has filter");
    ASSERT.equal(String(rule.getFilter().getRightValue()), "foo", "first rule filter is good");
    
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
    ASSERT.equal(rule.getMinScaleDenominator(), 0, "second rule has correct min scale denominator");
    ASSERT.equal(rule.getMaxScaleDenominator(), Infinity, "second rule has correct max scale denominator");
    
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
    system.exit(require("test").run(exports));
}
