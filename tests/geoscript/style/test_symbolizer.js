var ASSERT = require("assert");
var STYLE = require("geoscript/style");
var Filter = require("geoscript/filter").Filter;

exports["test: constructor"] = function() {
    
    var symbolizer = new STYLE.Symbolizer({});
    
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "is Symbolizer");

};

exports["test: where"] = function() {

    var symbolizer = new STYLE.Symbolizer({});
    
    ASSERT.ok(!symbolizer.filter, "no filter before where");
    
    var o = symbolizer.where("foo='bar'");
    
    ASSERT.ok(o === symbolizer, "where returns self");
    ASSERT.ok(symbolizer.filter instanceof Filter, "where sets filter");
    
    ASSERT.strictEqual(symbolizer.filter.cql, "foo = 'bar'", "correct filter");
    
};

exports["test: range"] = function() {

    var symbolizer = new STYLE.Symbolizer({});
    
    ASSERT.ok(!symbolizer.minScaleDenominator, "no min before range");
    ASSERT.ok(!symbolizer.maxScaleDenominator, "no max before range");
    
    var o = symbolizer.range({min: 10, max: 20});
    
    ASSERT.ok(o === symbolizer, "range returns self");
    
    ASSERT.strictEqual(symbolizer.minScaleDenominator, 10, "correct min");
    ASSERT.strictEqual(symbolizer.maxScaleDenominator, 20, "correct max");
    
};

exports["test: and"] = function() {
    
    var s1 = new STYLE.Symbolizer({});
    var s2 = new STYLE.Symbolizer({});
    
    var style = s1.and(s2);
    ASSERT.ok(style instanceof STYLE.Style, "is Style");
    
    ASSERT.strictEqual(style.parts.length, 2, "composite has two parts");
    ASSERT.ok(style.parts[0] === s1, "first part");
    ASSERT.ok(style.parts[1] === s2, "second part");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
