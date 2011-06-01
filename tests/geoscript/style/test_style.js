var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Filter = require("geoscript/filter").Filter;

var geotools = Packages.org.geotools;

exports["test: constructor"] = function() {

    var style = new STYLE.Style({
        rules: [{
            maxScaleDenominator: 100000,
            symbolizers: [{
                type: "PolygonSymbolizer",
                fillColor: "#ff0000"
            }]
        }, {
            minScaleDenominator: 100000,
            symbolizers: [{
                type: "PolygonSymbolizer",
                fillColor: "#ffff00"
            }]
        }]
    });
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 2, "rules length 2");

    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule 0 created");
    ASSERT.equal(rule.maxScaleDenominator, 100000, "correct max scale denominator");
    ASSERT.equal(rule.symbolizers.length, 1, "rule 0 symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "rule 0 poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ff0000", "rule 0 correct fill color");

    rule = style.rules[1];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule 1 created");
    ASSERT.equal(rule.minScaleDenominator, 100000, "correct min scale denominator");
    ASSERT.equal(rule.symbolizers.length, 1, "rule 1 symbolizers length 1");
    symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "rule 1 poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ffff00", "rule 1 correct fill color");

};


exports["test: constructor (symbolizer config)"] = function() {

    var style = new STYLE.Style({
        type: "PolygonSymbolizer",
        fillColor: "#ff0000"
    });
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 1, "rules length 1");
    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ff0000", "correct fill color");

};

exports["test: constructor (symbolizer instance)"] = function() {
    
    var style = new STYLE.Style(new STYLE.LineSymbolizer({
        strokeColor: "#ff0000"
    }));
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 1, "rules length 1");
    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.LineSymbolizer, "line symbolizer");
    ASSERT.equal(symbolizer.strokeColor, "#ff0000", "correct stroke color");

};

exports["test: constructor (array of symbolizer config)"] = function() {

    var style = new STYLE.Style([{
        type: "PolygonSymbolizer",
        fillColor: "#ff0000"
    }, {
        type: "LineSymbolizer",
        strokeColor: "#ffff00"
    }]);
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 1, "rules length 1");
    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 2, "symbolizers length 2");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ff0000", "correct fill color");
    symbolizer = rule.symbolizers[1];
    ASSERT.ok(symbolizer instanceof STYLE.LineSymbolizer, "line symbolizer");
    ASSERT.equal(symbolizer.strokeColor, "#ffff00", "correct stroke color");

};

exports["test: constructor (rule config)"] = function() {

    var style = new STYLE.Style({
        filter: "value = 'foo'",
        maxScaleDenominator: 200000,
        minScaleDenominator: 100000,
        symbolizers: [{
            type: "PolygonSymbolizer",
            fillColor: "#ffff00"
        }]
    });
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 1, "rules length 1");
    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.ok(rule.filter instanceof Filter, "rule has filter");
    ASSERT.equal(rule.filter.cql, "value = 'foo'", "correct filter");
    ASSERT.equal(rule.minScaleDenominator, 100000, "correct min scale denominator");
    ASSERT.equal(rule.maxScaleDenominator, 200000, "correct max scale denominator");
    ASSERT.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ffff00", "correct fill color");

};

exports["test: constructor (rule instance)"] = function() {

    var style = new STYLE.Style(new STYLE.Rule({
        symbolizers: [{
            type: "PolygonSymbolizer",
            fillColor: "#ffffff"
        }]
    }));
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 1, "rules length 1");
    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ffffff", "correct fill color");

};

exports["test: constructor (array of rule config)"] = function() {

    var style = new STYLE.Style([{
        maxScaleDenominator: 100000,
        symbolizers: [{
            type: "PolygonSymbolizer",
            fillColor: "#ff0000"
        }]
    }, {
        minScaleDenominator: 100000,
        symbolizers: [{
            type: "PolygonSymbolizer",
            fillColor: "#ffff00"
        }]
    }]);
    
    ASSERT.ok(style instanceof STYLE.Style, "instance of Style");
    ASSERT.equal(style.rules.length, 2, "rules length 2");

    var rule = style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule 0 created");
    ASSERT.equal(rule.maxScaleDenominator, 100000, "correct max scale denominator");
    ASSERT.equal(rule.symbolizers.length, 1, "rule 0 symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "rule 0 poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ff0000", "rule 0 correct fill color");

    rule = style.rules[1];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule 1 created");
    ASSERT.equal(rule.minScaleDenominator, 100000, "correct min scale denominator");
    ASSERT.equal(rule.symbolizers.length, 1, "rule 1 symbolizers length 1");
    symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "rule 1 poly symbolizer");
    ASSERT.equal(symbolizer.fillColor, "#ffff00", "rule 1 correct fill color");

};


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
            filter: "value = 'foo'",
            maxScaleDenominator: 200000,
            minScaleDenominator: 100000,
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
    ASSERT.equal(rule.getMinScaleDenominator(), 100000, "second rule has correct min scale denominator");
    ASSERT.equal(rule.getMaxScaleDenominator(), 200000, "second rule has correct max scale denominator");
    ASSERT.ok(rule.getFilter() instanceof geotools.filter.IsEqualsToImpl, "second rule has filter");
    ASSERT.equal(String(rule.getFilter().getRightValue()), "foo", "second rule filter is good");
    
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
