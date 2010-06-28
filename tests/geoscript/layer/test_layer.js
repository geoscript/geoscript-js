var assert = require("assert");
var Layer = require("geoscript/layer").Layer;
var geom = require("geoscript/geom");
var STYLE = require("geoscript/style");

var admin = require("../../admin");

var shpDir = admin.shp.dest;
exports.setUp = admin.shp.setUp;
exports.tearDown = admin.shp.tearDown;

exports["test: constructor"] = function() {

    var l = new Layer();
    assert.ok(l instanceof Layer, "instanceof Layer");

};

exports["test: temporary"] = function() {
    
    var temp = new Layer({});
    assert.ok(temp.temporary);
        
    var shp = new Layer({
        workspace: shpDir,
        name: "states"
    });
    assert.isFalse(shp.temporary);
    
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
    assert.ok(layer.style instanceof STYLE.Style, "style object");
    assert.equal(layer.style.rules.length, 1, "rules length 1");
    var rule = layer.style.rules[0];
    assert.ok(rule instanceof STYLE.Rule, "rule created");
    assert.equal(rule.symbolizers.length, 1, "symbolizers length 1");
    var symbolizer = rule.symbolizers[0];
    assert.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "poly symbolizer");
    assert.equal(symbolizer.strokeColor, "#ff0000", "correct fill color");

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
    assert.ok(layer.style instanceof STYLE.Style, "style object");
    assert.equal(layer.style.rules.length, 1, "rules length 1");
    var rule = layer.style.rules[0];
    assert.ok(rule instanceof STYLE.Rule, "rule created");
    assert.equal(rule.symbolizers.length, 2, "symbolizers length 2");
    var symbolizer = rule.symbolizers[0];
    assert.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "first is poly symbolizer");
    assert.equal(symbolizer.strokeColor, "#ff0000", "first has correct stroke color");
    assert.equal(symbolizer.strokeWidth, 2, "first has correct stroke width");

    symbolizer = rule.symbolizers[1];
    assert.ok(symbolizer instanceof STYLE.PolygonSymbolizer, "second is poly symbolizer");
    assert.equal(symbolizer.strokeColor, "#0000ff", "second has correct stroke color");
    assert.equal(symbolizer.strokeWidth, 1, "second has correct stroke width");

};

exports["test: clone"] = function() {

    var clone;
    var temp = new Layer({name: "foo"});

    // create a clone without providing a name
    clone = temp.clone();
    assert.ok(clone instanceof Layer, "clone is a Layer");
    assert.ok(typeof clone.name === "string", "clone has a name");
    assert.ok(clone.name !== temp.name, "clone gets a new name");
    
    // create a clone with a new name
    clone = temp.clone("bar");
    assert.strictEqual(clone.name, "bar", "clone can be given a new name");
    
    // clone an existing layer with features
    var shp = new Layer({
        workspace: shpDir,
        name: "states"
    });
    // confim that original has a projection set
    assert.ok(!!shp.projection, "original has projection");
    
    clone = shp.clone();
    assert.ok(clone.temporary, "clone is a temporary layer");
    assert.strictEqual(clone.count, shp.count, "clone has same count as original");
    assert.ok(shp.projection.equals(clone.projection), "clone projection equals original");

};

if (require.main == module.id) {
    require("test").run(exports);
}
