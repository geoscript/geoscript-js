var ASSERT = require("assert");
var GEOM = require("geoscript/geom");

exports["test: create(point)"] = function() {
    var type = "Point";
    var coordinates = [1, 2];    
    var o, g;
    
    // create a point
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.Point, "point created");
    g = new GEOM.Point(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad point");

    // create a point with coords only
    o = GEOM.create(coordinates);
    ASSERT.ok(o instanceof GEOM.Point, "[coords only] point created");
    g = new GEOM.Point(coordinates);
    ASSERT.ok(g.equals(o), "[coords only] equivalent to trad point");

};

exports["test: create(linestring)"] = function() {
    var type = "LineString";
    var coordinates = [[0, 1], [1, 2]];
    var o, g;

    // create a linestring
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.LineString, "linestring created");
    g = new GEOM.LineString(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad linestring");
    
    // create a linestring with coords only
    o = GEOM.create(coordinates);
    ASSERT.ok(o instanceof GEOM.LineString, "[coords only] linestring created");
    g = new GEOM.LineString(coordinates);
    ASSERT.ok(g.equals(o), "[coords only] equivalent to trad linestring");

};

exports["test: create(polygon)"] = function() {
    var type = "Polygon";
    var coordinates = [
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ];
    var o, g;

    // create a polygon
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.Polygon, "polygon created");
    g = new GEOM.Polygon(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad polygon");
    
    // create a polygon with coords only
    o = GEOM.create(coordinates);
    ASSERT.ok(o instanceof GEOM.Polygon, "[coords only] polygon created");
    g = new GEOM.Polygon(coordinates);
    ASSERT.ok(g.equals(o), "[coords only] equivalent to trad polygon");

};

exports["test: create(multipoint)"] = function() {
    var type = "MultiPoint";
    var coordinates = [[0, 1], [1, 2]];
    var o, g;

    // create a multipoint
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.MultiPoint, "multipoint created");
    g = new GEOM.MultiPoint(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad multipoint");
    
    /**
     * MultiPoint and LineString coordinates cannot be disambiguated.
     * LineString gets precedence and MultiPoint cannot be created without
     * specifying type in the config.
     */

};

exports["test: create(multilinestring)"] = function() {
    var type = "MultiLineString";
    var coordinates = [[[0, 1], [1, 2]], [[2, 3], [3, 4]]];
    var o, g;

    // create a multilinestring
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.MultiLineString, "multilinestring created");
    g = new GEOM.MultiLineString(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad multilinestring");

    /**
     * MultiLineString and Polygon coordinates cannot be disambiguated.
     * Polygon gets precedence and MultiLineString cannot be created without
     * specifying type in the config.
     */

};

exports["test: create(multipolygon)"] = function() {
    var type = "MultiPolygon";
    var coordinates = [[
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ], [
        [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
    ]];
    var o, g;

    // create a multipolygon
    o = GEOM.create({type: type, coordinates: coordinates});
    ASSERT.ok(o instanceof GEOM.MultiPolygon, "multipolygon created");
    g = new GEOM.MultiPolygon(coordinates);
    ASSERT.ok(g.equals(o), "equivalent to trad multipolygon");

    // create a multipolygon with coords only
    o = GEOM.create(coordinates);
    ASSERT.ok(o instanceof GEOM.MultiPolygon, "[coords only] multipolygon created");
    g = new GEOM.MultiPolygon(coordinates);
    ASSERT.ok(g.equals(o), "[coords only] equivalent to trad multipolygon");

};

exports["test: create(bounds)"] = function() {
    
    var b, o;
    
    // min/max x/y
    b = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    o = GEOM.create({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    ASSERT.ok(o instanceof GEOM.Bounds, "[min/max x/y] bounds created");
    ASSERT.ok(o.equals(b), "[min/max x/y] equivalent to constructor");

    // projection
    b = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90, projection: "epsg:4326"
    });
    o = GEOM.create({
        minX: -180, maxX: 180, minY: -90, maxY: 90, projection: "epsg:4326"
    });
    ASSERT.ok(o instanceof GEOM.Bounds, "[projection] bounds created");
    ASSERT.ok(o.equals(b), "[projection] equivalent to constructor");

    // from config
    b = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90, projection: "epsg:4326"
    });
    o = GEOM.create(b.config);
    ASSERT.ok(o instanceof GEOM.Bounds, "[config] bounds created");
    ASSERT.ok(o.equals(b), "[config] equivalent to constructor");
    
};

exports["test: create voronoi diagram"] = function() {

    var geom = GEOM.Point([1,1]).buffer(50)
    var points = geom.randomPoints(20)
    var diagram = points.createVoronoiDiagram()
    ASSERT.ok(diagram instanceof GEOM.GeometryCollection)
    ASSERT.ok(diagram.components.length > 0, "there should be more than 0 polygons");

}

exports["test: create random points"] = function() {

    var geom = GEOM.Point([1,1]).buffer(10)
    var points = geom.randomPoints(10)
    ASSERT.ok(points instanceof GEOM.MultiPoint)
    ASSERT.strictEqual(points.components.length, 10, "geometry has 10 components");

}

exports["test: largest empty circle"] = function() {

    var geom = new GEOM.Polygon([[
        [-122.38855361938475, 47.5805786829606], [-122.38636493682861, 47.5783206388176],
        [-122.38700866699219, 47.5750491969984], [-122.38177299499512, 47.57502024527343],
        [-122.38481998443604, 47.5780600889959], [-122.38151550292969, 47.5805786829606],
        [-122.38855361938475, 47.5805786829606]
    ]]);
    ASSERT.ok(geom instanceof GEOM.Polygon);
    var circle = geom.getLargestEmptyCircle({tolerance: 1.0});
    ASSERT.ok(circle instanceof GEOM.Polygon);

}

exports["test: create conforming delaunay triangles"] = function() {

    var geom = GEOM.Point([1,1]).buffer(50)
    var points = geom.randomPoints(20)
    var triangles = points.createDelaunayTriangles(true)
    ASSERT.ok(triangles instanceof GEOM.GeometryCollection)
    ASSERT.ok(triangles.components.length > 0, "there should be more than 0 triangles");

}

exports["test: create non-conforming delaunay triangles"] = function() {

    var geom = GEOM.Point([1,1]).buffer(50)
    var points = geom.randomPoints(20)
    var triangles = points.createDelaunayTriangles(false)
    ASSERT.ok(triangles instanceof GEOM.GeometryCollection)
    ASSERT.ok(triangles.components.length > 0, "there should be more than 0 triangles");

}

exports["test: variable buffer"] = function() {

    var geom = new GEOM.LineString([[1,2], [10,20], [30,50], [100, 150]]);
    var buffer = geom.variableBuffer([10,50])
    ASSERT.ok(buffer instanceof GEOM.Polygon)

    buffer = geom.variableBuffer([10, 20, 50])
    ASSERT.ok(buffer instanceof GEOM.Polygon)

    buffer = geom.variableBuffer([10, 20, 50, 75])
    ASSERT.ok(buffer instanceof GEOM.Polygon)

}

exports["test: Point"] = require("./geom/test_point");
exports["test: LineString"] = require("./geom/test_linestring");
exports["test: Polygon"] = require("./geom/test_polygon");
exports["test: Collection"] = require("./geom/test_collection");
exports["test: MultiLineString"] = require("./geom/test_multilinestring");
exports["test: Bounds"] = require("./geom/test_bounds");
exports["test: CircularString"] = require("./geom/test_circularstring");
exports["test: CompoundCurve"] = require("./geom/test_compoundcurve");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
