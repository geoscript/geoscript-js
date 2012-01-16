var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var l = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    ASSERT.ok(l instanceof GEOM.Geometry, "line is a geometry");
    ASSERT.ok(l instanceof GEOM.LineString, "line is a line");
    ASSERT.strictEqual(l.coordinates.length, 3, "line has three coordinates");
    ASSERT.strictEqual(l.length, 402.49223594996215, "line has correct length");
    
    var p0 = new GEOM.Point([-180, -90]);
    var p1 = new GEOM.Point([0, 0]);
    var p2 = new GEOM.Point([180, 90]);
    var l2 = new GEOM.LineString([p0, p1, p2]);

    ASSERT.ok(l2 instanceof GEOM.Geometry, "l2 is a geometry");
    ASSERT.ok(l2 instanceof GEOM.LineString, "l2 is a line");
    ASSERT.strictEqual(l2.coordinates.length, 3, "l2 has three coordinates");
    ASSERT.strictEqual(l2.length, 402.49223594996215, "l2 has correct length");
    ASSERT.ok(l.equals(l2), "lines are equal");
    
};

exports["test: json"] = function() {

    var g = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    var json = g.json;
    ASSERT.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "LineString", "correct type");
        ASSERT.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var l, b;
    
    l = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    b = l.bounds;
    
    ASSERT.ok(b instanceof GEOM.Bounds, "is bounds");
    ASSERT.deepEqual([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    l.projection = "epsg:4326";
    b = l.bounds;
    ASSERT.ok(b instanceof GEOM.Bounds, "[projection] is bounds");
    ASSERT.deepEqual([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    ASSERT.ok(b.projection instanceof PROJ.Projection, "[projection] has projection");
    ASSERT.strictEqual(b.projection.id, "EPSG:4326", "[projection] correct projection");

};

exports["test: startPoint"] = function() {

    var g = new GEOM.LineString([[0, 0], [1, 1], [2, 2]]);
    
    var p = g.startPoint;
    
    ASSERT.ok(p instanceof GEOM.Point, "startPoint is point");
    ASSERT.ok(p.equals(new GEOM.Point([0, 0])), "correct startPoint");

};

exports["test: endPoint"] = function() {

    var g = new GEOM.LineString([[0, 0], [1, 1], [2, 2]]);
    
    var p = g.endPoint;
    
    ASSERT.ok(p instanceof GEOM.Point, "endPoint is point");
    ASSERT.ok(p.equals(new GEOM.Point([2, 2])), "correct endPoint");

};

exports["test: reverse"] = function() {

    var g = new GEOM.LineString([[0, 0], [1, 1], [2, 2]]);
    
    var r = g.reverse();
    
    ASSERT.ok(r instanceof GEOM.LineString, "reverse is linestring");
    ASSERT.ok(r.equals(new GEOM.LineString([[2, 2], [1, 1], [0, 0]])), "correct linestring");

};

exports["test: dimension"] = function() {

    var g = new GEOM.LineString([[-20, -10], [-10, 0]]);
    ASSERT.strictEqual(g.dimension, 1, "correct dimension");

};


exports["test: centroid"] = function() {

    var g = new GEOM.LineString([[-20, -10], [-10, 0]]);
    
    var c = g.centroid;
    ASSERT.ok(c instanceof GEOM.Point, "centroid is point");
    ASSERT.ok(c.equals(new GEOM.Point([-15, -5])), "correct centroid");

};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}