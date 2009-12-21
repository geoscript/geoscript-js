var assert = require("test/assert");
var geom = require("geoscript/geom");

exports["test: create(point)"] = function() {
    var type = "Point";
    var coordinates = [1, 2];    
    var o, g;
    
    // create a point
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.Point, "point created");
    g = new geom.Point(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad point");

    // create a point with coords only
    o = geom.create(coordinates);
    assert.isTrue(o instanceof geom.Point, "[coords only] point created");
    g = new geom.Point(coordinates);
    assert.isTrue(g.equals(o), "[coords only] equivalent to trad point");

};

exports["test: create(linestring)"] = function() {
    var type = "LineString";
    var coordinates = [[0, 1], [1, 2]];    
    var o, g;

    // create a linestring
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.LineString, "linestring created");
    g = new geom.LineString(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad linestring");
    
    // create a linestring with coords only
    o = geom.create(coordinates);
    assert.isTrue(o instanceof geom.LineString, "[coords only] linestring created");
    g = new geom.LineString(coordinates);
    assert.isTrue(g.equals(o), "[coords only] equivalent to trad linestring");

};

exports["test: create(polygon)"] = function() {
    var type = "Polygon";
    var coordinates = [
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ];
    var o, g;

    // create a polygon
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.Polygon, "polygon created");
    g = new geom.Polygon(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad polygon");
    
    print("passed");
    
    // create a polygon with coords only
    //o = geom.create(coordinates);
    //assert.isTrue(o instanceof geom.Polygon, "[coords only] polygon created");
    //g = new geom.Polygon(coordinates);
    //assert.isTrue(g.equals(o), "[coords only] equivalent to trad polygon");

};

exports["test: create(multipoint)"] = function() {
    var type = "MultiPoint";
    var coordinates = [[0, 1], [1, 2]];
    var o, g;

    // create a multipoint
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiPoint, "multipoint created");
    g = new geom.MultiPoint(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multipoint");
    
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
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiLineString, "multilinestring created");
    g = new geom.MultiLineString(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multilinestring");

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
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiPolygon, "multipolygon created");
    g = new geom.MultiPolygon(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multipolygon");

    // create a multipolygon with coords only
    o = geom.create(coordinates);
    assert.isTrue(o instanceof geom.MultiPolygon, "[coords only] multipolygon created");
    g = new geom.MultiPolygon(coordinates);
    assert.isTrue(g.equals(o), "[coords only] equivalent to trad multipolygon");

};

exports["test: Point"] = require("./geom/test_point");
exports["test: Linestring"] = require("./geom/test_linestring");
exports["test: Polygon"] = require("./geom/test_polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
