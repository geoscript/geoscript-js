var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var WKT = require("geoscript/io/wkt");

exports["test: constructor"] = function() {

    var checkPoint = function(i, pt, x, y) {
        ASSERT.ok(pt instanceof GEOM.Point, "cr control point #" + i + " is a point");
        ASSERT.strictEqual(pt.x, x, "cr control point #" + i + " x is " + x);
        ASSERT.strictEqual(pt.y, y, "cr control point #" + i + " y is " + y);
    };

    var cs = new GEOM.CircularString([[6.12, 10.0], [7.07, 7.07], [10.0, 0.0]]);

    ASSERT.ok(cs instanceof GEOM.Geometry, "cs is a geometry");
    ASSERT.ok(cs instanceof GEOM.CircularString, "cs is a circularstring");
    ASSERT.strictEqual(cs.controlPoints.length, 3, "cs has three control points");
    checkPoint(0, cs.controlPoints[0], 6.12, 10.0);
    checkPoint(1, cs.controlPoints[1], 7.07, 7.07);
    checkPoint(2, cs.controlPoints[2], 10.0, 0.0);
    ASSERT.ok(cs.linear instanceof GEOM.LineString,"cs linear is a linestring");
    ASSERT.strictEqual("CIRCULARSTRING(6.12 10.0, 7.07 7.07, 10.0 0.0)", cs.curvedWkt, "cs curved wkt is CIRCULARSTRING(6.12 10.0, 7.07 7.07, 10.0 0.0)");
    var csFromWkt = WKT.read("CIRCULARSTRING(6.12 10.0, 7.07 7.07, 10.0 0.0)");
    ASSERT.deepEqual(cs, csFromWkt);

    var p0 = new GEOM.Point([6.12, 10.0]);
    var p1 = new GEOM.Point([7.07, 7.07]);
    var p2 = new GEOM.Point([10.0, 0.0]);
    var cs2 = new GEOM.CircularString([p0, p1, p2]);

    ASSERT.ok(cs2 instanceof GEOM.Geometry, "cs2 is a geometry");
    ASSERT.ok(cs2 instanceof GEOM.CircularString, "cs2 is a circularstring");
    ASSERT.strictEqual(cs2.controlPoints.length, 3, "cs2 has three control points");
    checkPoint(0, cs.controlPoints[0], 6.12, 10.0);
    checkPoint(1, cs.controlPoints[1], 7.07, 7.07);
    checkPoint(2, cs.controlPoints[2], 10.0, 0.0);
    ASSERT.ok(cs2.linear instanceof GEOM.LineString,"cs2 linear is a linestring");
    ASSERT.strictEqual("CIRCULARSTRING(6.12 10.0, 7.07 7.07, 10.0 0.0)", cs2.curvedWkt, "cs2 curved wkt is CIRCULARSTRING(6.12 10.0, 7.07 7.07, 10.0 0.0)");

};