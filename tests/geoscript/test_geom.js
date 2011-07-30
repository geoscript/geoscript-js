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
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    o = GEOM.create({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    ASSERT.ok(o instanceof GEOM.Bounds, "[min/max x/y] bounds created");
    ASSERT.ok(o.equals(b), "[min/max x/y] equivalent to constructor");

    // projection
    b = new GEOM.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
    });
    o = GEOM.create({
        minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
    });
    ASSERT.ok(o instanceof GEOM.Bounds, "[projection] bounds created");
    ASSERT.ok(o.equals(b), "[projection] equivalent to constructor");

    // from config
    b = new GEOM.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
    });
    o = GEOM.create(b.config);
    ASSERT.ok(o instanceof GEOM.Bounds, "[config] bounds created");
    ASSERT.ok(o.equals(b), "[config] equivalent to constructor");
    
};

exports["test: Point"] = require("./geom/test_point");
exports["test: LineString"] = require("./geom/test_linestring");
exports["test: Polygon"] = require("./geom/test_polygon");
exports["test: Collection"] = require("./geom/test_collection");
exports["test: MultiLineString"] = require("./geom/test_multilinestring");
exports["test: Bounds"] = require("./geom/test_bounds");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
