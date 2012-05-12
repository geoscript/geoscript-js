var ASSERT = require("assert");
var Layer = require("geoscript/layer").Layer;
var GEOM = require("geoscript/geom");
var STYLE = require("geoscript/style");

var ADMIN = require("../../admin");

var shpDir = ADMIN.shp.dest;
exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

exports["test: constructor"] = function() {

    var l = new Layer();
    ASSERT.ok(l instanceof Layer, "instanceof Layer");

};

exports["test: temporary"] = function() {
    
    var temp = new Layer({});
    ASSERT.ok(temp.temporary);
        
    var shp = new Layer({
        workspace: shpDir,
        name: "states"
    });
    ASSERT.isFalse(shp.temporary);
    
};

exports["test: style (single symbolizer)"] = function() {
    
    var layer = new Layer({
        workspace: shpDir,
        name: "states"
    });
    var rule, symbolizer;
    
    // test single symbolizer
    layer.style = {
        strokeColor: "#ff0000"
    };
    ASSERT.ok(layer.style instanceof STYLE.Style, "style object");
    ASSERT.equal(layer.style.rules.length, 1, "rules length 1");
    var rule = layer.style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    ASSERT.equal(symbolizer.strokeColor, "#ff0000", "correct fill color");

};

exports["test: style (multiple symbolizers)"] = function() {
    
    var layer = new Layer({
        workspace: shpDir,
        name: "states"
    });
    var rule, symbolizer;
    
    // test array of symbolizers
    layer.style = [{
        strokeColor: "#ff0000",
        strokeWidth: 2
    }, {
        strokeColor: "blue",
        strokeWidth: 1
    }];
    ASSERT.ok(layer.style instanceof STYLE.Style, "style object");
    ASSERT.equal(layer.style.rules.length, 1, "rules length 1");
    var rule = layer.style.rules[0];
    ASSERT.ok(rule instanceof STYLE.Rule, "rule created");
    ASSERT.equal(rule.symbolizers.length, 2, "symbolizers length 2");
    var symbolizer = rule.symbolizers[0];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "first is poly symbolizer");
    ASSERT.equal(symbolizer.strokeColor, "#ff0000", "first has correct stroke color");
    ASSERT.equal(symbolizer.strokeWidth, 2, "first has correct stroke width");

    symbolizer = rule.symbolizers[1];
    ASSERT.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "second is poly symbolizer");
    ASSERT.equal(symbolizer.strokeColor, "#0000ff", "second has correct stroke color");
    ASSERT.equal(symbolizer.strokeWidth, 1, "second has correct stroke width");

};

exports["test: clone"] = function() {

    var clone;
    var temp = new Layer({name: "foo"});

    // create a clone without providing a name
    clone = temp.clone();
    ASSERT.ok(clone instanceof Layer, "clone is a Layer");
    ASSERT.ok(typeof clone.name === "string", "clone has a name");
    ASSERT.ok(clone.name !== temp.name, "clone gets a new name");
    
    // create a clone with a new name
    clone = temp.clone("bar");
    ASSERT.strictEqual(clone.name, "bar", "clone can be given a new name");
    
    // clone an existing layer with features
    var shp = new Layer({
        workspace: shpDir,
        name: "states"
    });
    // confim that original has a projection set
    ASSERT.ok(!!shp.projection, "original has projection");
    
    clone = shp.clone();
    ASSERT.ok(clone.temporary, "clone is a temporary layer");
    ASSERT.strictEqual(clone.count, shp.count, "clone has same count as original");
    ASSERT.ok(shp.projection.equals(clone.projection), "clone projection equals original");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
