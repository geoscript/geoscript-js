var assert = require("test/assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.isTrue(l instanceof geom.Geometry, "line is a geometry");
    assert.isTrue(l instanceof geom.LineString, "line is a line");
    assert.is(3, l.coordinates.length, "line has three coordinates");
    assert.is(402.49223594996215, l.length, "line has correct length");
    
};

exports["test: wkt"] = function() {

    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    assert.is("LINESTRING (-180 -90, 0 0, 180 90)", l.wkt, "correct wkt");

};

exports["test: json"] = function() {

    var g = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    var json = g.json;
    assert.is("string", typeof json, "json is string");
    var obj, msg;
    try {
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("LineString", obj.type, "correct type");
        assert.isSame(g.coordinates, obj.coordinates, "correct coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var l, b;
    
    l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    b = l.bounds;
    
    assert.isTrue(b instanceof geom.Bounds, "is bounds");
    assert.isSame([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    l.projection = "epsg:4326";
    b = l.bounds;
    assert.isTrue(b instanceof geom.Bounds, "[projection] is bounds");
    assert.isSame([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    assert.isTrue(b.projection instanceof proj.Projection, "[projection] has projection");
    assert.is("EPSG:4326", b.projection.id, "[projection] correct projection");

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}