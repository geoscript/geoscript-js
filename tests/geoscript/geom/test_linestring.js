var assert = require("assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.ok(l instanceof geom.Geometry, "line is a geometry");
    assert.ok(l instanceof geom.LineString, "line is a line");
    assert.strictEqual(l.coordinates.length, 3, "line has three coordinates");
    assert.strictEqual(l.length, 402.49223594996215, "line has correct length");
    
};

exports["test: json"] = function() {

    var g = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    var json = g.json;
    assert.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.strictEqual(obj.type, "LineString", "correct type");
        assert.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        assert.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var l, b;
    
    l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    b = l.bounds;
    
    assert.ok(b instanceof geom.Bounds, "is bounds");
    assert.deepEqual([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    l.projection = "epsg:4326";
    b = l.bounds;
    assert.ok(b instanceof geom.Bounds, "[projection] is bounds");
    assert.deepEqual([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    assert.ok(b.projection instanceof proj.Projection, "[projection] has projection");
    assert.strictEqual(b.projection.id, "EPSG:4326", "[projection] correct projection");

};

exports["test: centroid"] = function() {

    var g = new geom.LineString([[-20, -10], [-10, 0]]);
    
    var c = g.centroid;
    assert.ok(c instanceof geom.Point, "centroid is point");
    assert.ok(c.equals(new geom.Point([-15, -5])), "correct centroid");

};


if (require.main == module.id) {
    require("test").run(exports);
}