var assert = require("assert");
var admin = require("../../admin");

var raster = require("geoscript/raster");
var geom = require('geoscript/geom');
var proj = require('geoscript/proj');

exports["test: create a raster from data"] = function() {
    var ras = new raster.Raster([
     [1,1,1,1,1],
     [1,2,2,2,1],
     [1,2,3,2,1]
    ], new geom.Bounds([0,0,10,10]))
    assert.ok(ras instanceof raster.Raster, "instance should be Raster");
    assert.strictEqual(1, ras.getMinValue(), "Min value should be 1");
    assert.strictEqual(3, ras.getMaxValue(), "Max value should be 3");
};

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

exports["test: crop a raster with a bounds"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var smallTif = tif.crop(new geom.Bounds([-180,-90, 0, 0]))
    var bounds = smallTif.bounds;
    assert.strictEqual(-180, Math.round(bounds.minX), "Min X should be -180");
    assert.strictEqual(-90,  Math.round(bounds.minY), "Min Y should be -90");
    assert.strictEqual(0,    Math.round(bounds.maxX), "Max X should be 0");
    assert.strictEqual(0,    Math.round(bounds.maxY), "Max Y should be 0");
};

exports["test: crop a raster with a geometry"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var smallTif = tif.crop(new geom.Point([0, 0]).buffer(4))
    var bounds = smallTif.bounds;
    assert.strictEqual(-4, Math.round(bounds.minX), "Min X should be -4");
    assert.strictEqual(-4, Math.round(bounds.minY), "Min Y should be -4");
    assert.strictEqual(4,  Math.round(bounds.maxX), "Max X should be 4");
    assert.strictEqual(4,  Math.round(bounds.maxY), "Max Y should be 4");
};

exports["test: reproject a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({}).crop(new geom.Point([0, 0]).buffer(4));
    var reprojectedTif = tif.reproject(new proj.Projection("EPSG:3857"));
    assert.strictEqual("EPSG:4326", tif.proj.id, "Original raster should be EPSG:4326");
    assert.strictEqual("EPSG:3857", reprojectedTif.proj.id, "Original raster should be EPSG:3857");
};

exports["test: reclassify a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var reclassifiedTif = tif.reclassify([
        {min: -1000, max: 0, value: -1},
        {min: 0, max: 50, value: 1},
        {min: 50, max: 100, value: 2},
        {min: 100, max: 2000, value: 3}
    ], {noData: 0});
    assert.strictEqual(-1, reclassifiedTif.getValue(new geom.Point([-175.8, 81.8]), "double")[0], "Value should be -1");
    assert.strictEqual(-1, reclassifiedTif.getValue({x: 10, y: 20}, "double")[0], "Value should be -1");
};

exports["test: get min and max values for a raster band"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.strictEqual(49, tif.getMinValue(0));
    assert.strictEqual(255, tif.getMaxValue(0));
};

exports["test: get block size"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var blockSize = tif.blockSize;
    assert.strictEqual(900, blockSize[0], "Block Size Width should be 900");
    assert.strictEqual(9, blockSize[1], "Block Size Height should be 9 ");
};

exports["test: get pixel size"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var pixelSize = tif.pixelSize;
    assert.strictEqual(0.4, pixelSize[0], "Pixel Size Width should be 0.4");
    assert.strictEqual(0.4, pixelSize[1], "Pixel Size Height should be 0.4");
};

exports["test: get extrema for all raster bands"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    var extrema = tif.extrema
    assert.strictEqual(49, extrema.min[0]);
    assert.strictEqual(255, extrema.max[0]);
};