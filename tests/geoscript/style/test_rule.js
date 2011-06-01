var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Filter = require("geoscript/filter").Filter;

exports["test: constructor"] = function() {
    
    var rule = new STYLE.Rule({});
    
    ASSERT.ok(rule instanceof STYLE.Rule, "rule is a Rule");

    var rule = new STYLE.Rule({
        minScaleDenominator: 100000,
        filter: "STATE_ABBR = 'TX'",
        symbolizers: [{
            type: "PolygonSymbolizer",
            fillColor: "#0000ff"
        }]
    });
    ASSERT.strictEqual(rule.minScaleDenominator, 100000, "min scale denominator set");
    ASSERT.ok(rule.filter instanceof Filter, "filter is a Filter");
    ASSERT.strictEqual(rule.symbolizers.length, 1, "one symbolizer");
    ASSERT.ok(rule.symbolizers[0] instanceof STYLE.PolygonSymbolizer, "point symbolizer");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
