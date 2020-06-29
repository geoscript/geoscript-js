var assert = require("assert");
var admin = require("../../admin");

var raster = require("geoscript/raster");
var geom = require('geoscript/geom');
var proj = require('geoscript/proj');

exports["test: read a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.ok(tif instanceof raster.Raster, "instance should be Raster");
};

exports["test: get raster name"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.strictEqual("raster", tif.name, "Name should be raster");
};

exports["test: get raster projection"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.strictEqual("EPSG:4326", tif.proj.id, "Projection should be EPSG:4326");
};

exports["test: get raster bounds"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var bounds = tif.bounds
    assert.strictEqual(-180, Math.round(bounds.minX), "Min X should be -180");
    assert.strictEqual(-90, Math.round(bounds.minY), "Min Y should be -90");
    assert.strictEqual(180, Math.round(bounds.maxX), "Max X should be 180");
    assert.strictEqual(90,  Math.round(bounds.maxY), "Max Y should be 90");
};

exports["test: get raster size"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var size = tif.size
    assert.strictEqual(2, size.length, "Size should be an array with two entries (width and height)");
    assert.strictEqual(900, size[0],  "Width should be 900");
    assert.strictEqual(450, size[1], "Height should be 450");
};

exports["test: get raster columns and rows"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.strictEqual(900, tif.cols,  "Columns should be 900");
    assert.strictEqual(450, tif.rows, "Rows should be 450");
};

exports["test: get raster bands"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var bands = tif.bands;
    assert.strictEqual(1, bands.length,  "There should be 1 band");
    assert.strictEqual(-Infinity, bands[0].min,  "Get band min");
    assert.strictEqual(Infinity, bands[0].max,  "Get band max");
    assert.strictEqual(undefined, bands[0].nodata,  "Get band no data");
    assert.strictEqual(1, bands[0].scale,  "Get band scale");
    assert.strictEqual(0, bands[0].offset,  "Get band offset");
    assert.strictEqual("byte", bands[0].type,  "Get band type");
    assert.strictEqual("GRAY_INDEX", bands[0].description,  "Get band description");
};

exports["test: get raster point from pixel"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var pt = tif.getPoint(10,20);
    assert.strictEqual("-175.8", pt.x.toFixed(1),  "Point x should be -175.8");
    assert.strictEqual("81.8", pt.y.toFixed(1), "Point y should be 81.8");
};


exports["test: get raster point from pixel"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.strictEqual(-69, tif.getValue(new geom.Point([-175.8, 81.8]), "double")[0], "Value should be -69");
    assert.strictEqual(-69, tif.getValue({x: 10, y: 20}, "double")[0], "Value should be -69");
};

exports["test: get raster pixel from point"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var pixel = tif.getPixel(new geom.Point([-175.8, 81.8]));
    assert.strictEqual(10, pixel.x, "Value should be 10");
    assert.strictEqual(20, pixel.y, "Value should be 20");
};

exports["test: crop a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var smallTif = tif.crop(new geom.Bounds([-180,-90, 0, 0]))
    var bounds = smallTif.bounds;
    assert.strictEqual(-180, Math.round(bounds.minX), "Min X should be -180");
    assert.strictEqual(-90,  Math.round(bounds.minY), "Min Y should be -90");
    assert.strictEqual(0,    Math.round(bounds.maxX), "Max X should be 0");
    assert.strictEqual(0,    Math.round(bounds.maxY), "Max Y should be 0");
};