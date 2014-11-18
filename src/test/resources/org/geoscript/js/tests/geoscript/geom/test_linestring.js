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

exports["test: interpolatePoint"] = function() {
    var line = new GEOM.LineString([
        [1137466.548141059, 650434.9943107369],
        [1175272.4129268457, 648011.541439853],
        [1185935.6055587344, 632986.1336403737]
    ]);

    // Interpolate Point Start
    var pt1 = line.interpolatePoint(0);
    ASSERT.ok(pt1.equals(line.startPoint), "interpolate 0 should return start point");

    // Interpolate Point Middle
    var pt2 = line.interpolatePoint(0.5);
    ASSERT.ok(pt2.equals(new GEOM.Point([1165562.9204493894, 648633.9448037925])), "interpolate 0.5 should return mid point");

    // Interpolate Point End
    var pt3 = line.interpolatePoint(1.0);
    ASSERT.ok(pt3.equals(line.endPoint), "interpolate 1 should return end point");
};

exports["test: locatePoint"] = function() {
    var line = new GEOM.LineString([
        [1137466.548141059, 650434.9943107369],
        [1175272.4129268457, 648011.541439853],
        [1185935.6055587344, 632986.1336403737]
    ]);
    var point = new GEOM.Point([1153461.34, 649950.30]);
    var position = line.locatePoint(point);
    ASSERT.deepEqual(0.284, position.toFixed(3), "locate point position should be 0.284");
};

exports["test: placePoint"] = function() {
    var line = new GEOM.LineString([
        [1137466.548141059, 650434.9943107369],
        [1175272.4129268457, 648011.541439853],
        [1185935.6055587344, 632986.1336403737]
    ]);
    var point = new GEOM.Point([1153461.34, 649950.30]);
    var placedPoint = line.placePoint(point) ;
    ASSERT.ok(placedPoint.equals(new GEOM.Point([1153426.8271476042, 649411.899502625])),
        "placed point should be POINT (1153426.8271476042 649411.899502625)");
};

exports["test: subLine"] = function() {
    var line = new GEOM.LineString([
        [1137466.548141059, 650434.9943107369],
        [1175272.4129268457, 648011.541439853],
        [1185935.6055587344, 632986.1336403737]
    ]);
    var subLine = line.subLine(0.33, 0.67);
    ASSERT.ok(
        new GEOM.LineString([[1156010.153864557, 649246.3016361536], [1175115.6870342216, 648021.5879714314]]).equals(subLine),
        "subline should be LINESTRING (1156010.153864557 649246.3016361536, 1175115.6870342216 648021.5879714314)"
    )
};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}