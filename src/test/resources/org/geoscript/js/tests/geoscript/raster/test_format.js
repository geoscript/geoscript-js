var assert = require("assert");
var admin = require("../../admin");
var fs = require("fs");

var raster = require("geoscript/raster");
var proj = require('geoscript/proj');

exports["test: format should get name"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    assert.strictEqual(format.name, "GeoTIFF", "Name should be GeoTIFF");
};

exports["test: format should read a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var tif = format.read({});
    assert.ok(tif instanceof raster.Raster, "instance should be Raster");
};

exports["test: format should write a raster"] = function() {
    var readFormat = new raster.Format({source: admin.raster.source});
    var readTif = readFormat.read({});
    var writeFormat = new raster.Format({source: admin.raster.writePng});
    writeFormat.write(readTif, {});
    var writePng = writeFormat.read({});
    assert.ok(writePng instanceof raster.Raster, "instance should be Raster");
};

exports["test: format should get names from a raster"] = function() {
    var format = new raster.Format({source: admin.raster.source});
    var names = format.names;
    assert.strictEqual(1, names.length, "should only have one name");
    assert.strictEqual("raster", names[0], "first and only name should be raster");
};