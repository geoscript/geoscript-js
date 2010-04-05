var ASSERT = require("test/assert");
var GEOM = require("geoscript/geom");
var read = require("geoscript/geom/io/wkt").read;
var write = require("geoscript/geom/io/wkt").write;

exports["test: read(point)"] = function() {
    var g1 = new GEOM.Point([1, 2]);
    var g2 = read("POINT (1 2)");
    ASSERT.isTrue(g2 instanceof GEOM.Geometry, "point from wkt is a geometry");
    ASSERT.isTrue(g2 instanceof GEOM.Point, "point from wkt is a point");
    ASSERT.isTrue(g2.equals(g1), "g2 equals g1");
};

exports["test: read(linestring)"] = function() {
    var g1 = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    var g2 = read("LINESTRING (-180 -90, 0 0, 180 90)");
    ASSERT.isTrue(g2 instanceof GEOM.Geometry, "linestring from wkt is a geometry");
    ASSERT.isTrue(g2 instanceof GEOM.LineString, "linestring from wkt is a linestring");
    ASSERT.isTrue(g2.equals(g1), "g2 equals g1");
};

exports["test: read(polygon)"] = function() {
    var g1 = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var g2 = read("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))");
    ASSERT.isTrue(g2 instanceof GEOM.Geometry, "polygon from wkt is a geometry");
    ASSERT.isTrue(g2 instanceof GEOM.Polygon, "polygon from wkt is a polygon");
    ASSERT.isTrue(g2.equals(g1), "g2 equals g1");
};


exports["test: write(point)"] = function() {

    var p = new GEOM.Point([1, 2]);
    var wkt = write(p);
    ASSERT.is("POINT (1 2)", wkt, "correct wkt");

};

exports["test: write(linestring)"] = function() {

    var l = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    var wkt = write(l);
    ASSERT.is("LINESTRING (-180 -90, 0 0, 180 90)", wkt, "correct wkt");

};

exports["test: write(polygon)"] = function() {

    var p = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var wkt = write(p);
    ASSERT.is("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))", wkt, "correct wkt");

};


if (require.main == module) {
    require("test/runner").run(exports);
}
