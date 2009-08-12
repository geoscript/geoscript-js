var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports.test_Point = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.isTrue(p instanceof geom.Geometry, "point is a geometry");
    assert.isTrue(p instanceof geom.Point, "point is a point");
    assert.isEqual(2, p.coordinates.length, "point has two items in coordinates");
    assert.isEqual(1, p.x, "correct x coordinate");
    assert.isEqual(2, p.y, "correct y coordinate");
    assert.isEqual("POINT (1 2)", p.toWKT(), "correct wkt");

    /**
     * TODO: figure out why this throws an error
     */
    //var p2 = geom.Geometry.fromWKT("POINT (1 2)");
    //assert.isTrue(p2 instanceof geom.Geometry, "point from wkt is a geometry");
    //assert.isTrue(p2 instanceof geom.Point, "point from wkt is a point");
    //assert.isTrue(p2.equals(p), "p2 equals p");
    
    var p3 = new geom.Point([3, 4]);
    assert.isTrue(!p3.equals(p), "p3 does not equal p");
    
};

exports.test_LineString = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.isTrue(l instanceof geom.Geometry, "line is a geometry");
    assert.isTrue(l instanceof geom.LineString, "line is a line");
    assert.isEqual(3, l.coordinates.length, "line has three coordinates");
    assert.isEqual(402.49223594996215, l.getLength(), "line has correct length");
    assert.isEqual("LINESTRING (-180 -90, 0 0, 180 90)", l.toWKT(), "correct wkt");
    
};

exports.test_Polygon = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.isTrue(p instanceof geom.Geometry, "polygon is a geometry");
    assert.isTrue(p instanceof geom.Polygon, "polygon is a polygon");
    assert.isEqual(2, p.coordinates.length, "polygon has two items in coordinates");
    assert.isEqual(48600, p.getArea(), "polygon has correct area");
    assert.isEqual("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))", p.toWKT(), "correct wkt");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
