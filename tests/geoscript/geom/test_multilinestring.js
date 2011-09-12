var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var g = new GEOM.MultiLineString([[[-180, -90], [0, 0], [180, 90]], [[-10, -10], [0, 0], [10, 10]]]);
    
    ASSERT.ok(g instanceof GEOM.Geometry, "geometry is a geometry");
    ASSERT.ok(g instanceof GEOM.MultiLineString, "geometry is a multilinestring");
    ASSERT.strictEqual(g.components.length, 2, "geometry has two components");
    
};

exports["test: json"] = function() {

    var g = new GEOM.MultiLineString([[[-180, -90], [0, 0], [180, 90]], [[-10, -10], [0, 0], [10, 10]]]);
    var json = g.json;
    ASSERT.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "MultiLineString", "correct type");
        ASSERT.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: simplify"] = function() {

    var g = new GEOM.MultiLineString([[[1, 1], [2, 2], [3, 1], [4, 2]], [[-1, -1], [-2, -2], [-3, -1], [-4, -2]]]);
    g.projection = "epsg:4326";
    var g2 = g.simplify(2);

    ASSERT.ok(g2 instanceof GEOM.MultiLineString, "correct type");
    ASSERT.ok(g.length > g2.length, "simplified length is shorter");
    ASSERT.ok(g.projection.equals(g.projection), "same projection");

};


exports["test: bounds"] = function() {

    var l, b;
    
    var l = new GEOM.MultiLineString([[[-180, -90], [0, 0], [180, 90]], [[-10, -10], [0, 0], [10, 10]]]);
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

exports["test: endPoints"] = function() {

    var g = new GEOM.MultiLineString([[[-180, -90], [0, 0], [180, 90]], [[-10, -10], [0, 0], [10, 10]]]);
    
    var points = g.endPoints;
    
    ASSERT.strictEqual(points.length, 4, "correct number of end points");
    ASSERT.ok(points[0].equals(new GEOM.Point([-180, -90])), "correct first end point");
    ASSERT.ok(points[1].equals(new GEOM.Point([180, 90])), "correct second end point");
    ASSERT.ok(points[2].equals(new GEOM.Point([-10, -10])), "correct third end point");
    ASSERT.ok(points[3].equals(new GEOM.Point([10, 10])), "correct fourth end point");

};

exports["test: dimension"] = function() {

    var g = new GEOM.MultiLineString([[[-180, -90], [0, 0], [180, 90]], [[-10, -10], [0, 0], [10, 10]]]);
    ASSERT.strictEqual(g.dimension, 1, "correct dimension");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}