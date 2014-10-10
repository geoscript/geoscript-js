var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var WKT = require("geoscript/io/wkt");

exports["test: constructor"] = function() {

    var checkPoint = function(pt, x, y) {
        ASSERT.ok(pt instanceof GEOM.Point, "point is a point");
        ASSERT.strictEqual(pt.x, x, "point x is " + x);
        ASSERT.strictEqual(pt.y, y, "point y is " + y);
    };

    var cc = new GEOM.CompoundCurve([
        new GEOM.CircularString([[10.0, 10.0], [0.0, 20.0], [-10.0, 10.0]]),
        new GEOM.LineString([[-10.0, 10.0], [-10.0, 0.0], [10.0, 0.0], [5.0, 5.0]])
    ]);

    ASSERT.ok(cc instanceof GEOM.Geometry, "cc is a geometry");
    ASSERT.ok(cc instanceof GEOM.CompoundCurve, "cc is a compoundcurve");
    ASSERT.strictEqual(cc.components.length, 2, "cc has two components");
    ASSERT.ok(cc.components[0] instanceof GEOM.CircularString, "cc component 1 is a circularstring");
    ASSERT.ok(cc.components[1] instanceof GEOM.LineString, "cc component 2 is a linestring");
    var cs = cc.components[0];
    checkPoint(cs.controlPoints[0], 10.0, 10.0);
    checkPoint(cs.controlPoints[1], 0.0, 20.0);
    checkPoint(cs.controlPoints[2], -10.0, 10.0);
    var ls = cc.components[1];
    ASSERT.strictEqual(ls.coordinates.length, 4, "line has four coordinates");
    ASSERT.deepEqual([[-10.0, 10.0], [-10.0, 0.0], [10.0, 0.0], [5.0, 5.0]], ls.coordinates, "line coordinates match");
    ASSERT.ok(cc.linear instanceof GEOM.LineString,"cc linear is a linestring");
    ASSERT.strictEqual("COMPOUNDCURVE(CIRCULARSTRING(10.0 10.0, 0.0 20.0, -10.0 10.0), (-10.0 10.0, -10.0 0.0, 10.0 0.0, 5.0 5.0))", cc.curvedWkt, "cs curved wkt");
    var ccFromWkt = WKT.read("COMPOUNDCURVE(CIRCULARSTRING(10.0 10.0, 0.0 20.0, -10.0 10.0), (-10.0 10.0, -10.0 0.0, 10.0 0.0, 5.0 5.0))");
    ASSERT.deepEqual(cc, ccFromWkt);

    cc = new GEOM.CompoundCurve({
        geometries: [
            new GEOM.CircularString([[10.0, 10.0], [0.0, 20.0], [-10.0, 10.0]]),
            new GEOM.LineString([[-10.0, 10.0], [-10.0, 0.0], [10.0, 0.0], [5.0, 5.0]])
        ],
        tolerance: 25
    });

    ASSERT.ok(cc instanceof GEOM.Geometry, "cc is a geometry");
    ASSERT.ok(cc instanceof GEOM.CompoundCurve, "cc is a compoundcurve");
    ASSERT.strictEqual(cc.components.length, 2, "cc has two components");
    ASSERT.ok(cc.components[0] instanceof GEOM.CircularString, "cc component 1 is a circularstring");
    ASSERT.ok(cc.components[1] instanceof GEOM.LineString, "cc component 2 is a linestring");
    var cs = cc.components[0];
    checkPoint(cs.controlPoints[0], 10.0, 10.0);
    checkPoint(cs.controlPoints[1], 0.0, 20.0);
    checkPoint(cs.controlPoints[2], -10.0, 10.0);
    var ls = cc.components[1];
    ASSERT.strictEqual(ls.coordinates.length, 4, "line has four coordinates");
    ASSERT.deepEqual([[-10.0, 10.0], [-10.0, 0.0], [10.0, 0.0], [5.0, 5.0]], ls.coordinates, "line coordinates match");
    ASSERT.ok(cc.linear instanceof GEOM.LineString,"cc linear is a linestring");
    ASSERT.strictEqual("COMPOUNDCURVE(CIRCULARSTRING(10.0 10.0, 0.0 20.0, -10.0 10.0), (-10.0 10.0, -10.0 0.0, 10.0 0.0, 5.0 5.0))", cc.curvedWkt, "cs curved wkt");

};