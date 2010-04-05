var assert = require("test/assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");
    
exports["test: constructor"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.isTrue(p instanceof geom.Geometry, "polygon is a geometry");
    assert.isTrue(p instanceof geom.Polygon, "polygon is a polygon");
    assert.is(2, p.coordinates.length, "polygon has two items in coordinates");
    assert.is(48600, p.area, "polygon has correct area");
    
};

exports["test: json"] = function() {

    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var json = g.json;
    assert.is("string", typeof json, "json is string");
    var obj, msg;
    try {
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("Polygon", obj.type, "correct type");
        assert.isSame(g.coordinates, obj.coordinates, "correct coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var g, b;
    
    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    b = g.bounds;
    
    assert.isTrue(b instanceof geom.Bounds, "is bounds");
    assert.isSame([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    g.projection = "epsg:4326";
    b = g.bounds;
    assert.isTrue(b instanceof geom.Bounds, "[projection] is bounds");
    assert.isSame([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    assert.isTrue(b.projection instanceof proj.Projection, "[projection] has projection");
    assert.is("EPSG:4326", b.projection.id, "[projection] correct projection");

};

exports["test: centroid"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    var c = p.centroid;
    assert.isTrue(c instanceof geom.Point, "centroid is point");
    assert.isTrue(c.equals(new geom.Point([0, 0])), "correct centroid");

};


if (require.main == module) {
    require("test/runner").run(exports);
}
