var assert = require("test/assert");
var geom = require("geoscript/geom");

exports["test: create"] = function() {
    var type, coordinates, o, g;
    
    // create a point
    type = "Point";
    coordinates = [1, 2];    
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.Point, "point created");
    g = new geom.Point(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad point");

    // create a linestring
    type = "LineString";
    coordinates = [[0, 1], [1, 2]];    
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.LineString, "linestring created");
    g = new geom.LineString(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad linestring");
    
    
    // create a polygon
    type = "Polygon";
    coordinates = [
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ];
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.Polygon, "polygon created");
    g = new geom.Polygon(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad polygon");
    
    // create a multipoint
    type = "MultiPoint";
    coordinates = [[0, 1], [1, 2]];
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiPoint, "multipoint created");
    g = new geom.MultiPoint(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multipoint");
    
    // create a multilinestring
    type = "MultiLineString";
    coordinates = [[[0, 1], [1, 2]], [[2, 3], [3, 4]]];
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiLineString, "multilinestring created");
    g = new geom.MultiLineString(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multilinestring");

    // create a multipolygon
    type = "MultiPolygon";
    coordinates = [[
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ], [
        [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
    ]];
    o = geom.create({type: type, coordinates: coordinates});
    assert.isTrue(o instanceof geom.MultiPolygon, "multipolygon created");
    g = new geom.MultiPolygon(coordinates);
    assert.isTrue(g.equals(o), "equivalent to trad multipolygon");

};

exports["test: Point"] = require("./geom/test_point");
exports["test: Linestring"] = require("./geom/test_linestring");
exports["test: Polygon"] = require("./geom/test_polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
