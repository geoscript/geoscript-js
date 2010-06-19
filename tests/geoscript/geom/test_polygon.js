var assert = require("assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");
    
exports["test: constructor"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.ok(p instanceof geom.Geometry, "polygon is a geometry");
    assert.ok(p instanceof geom.Polygon, "polygon is a polygon");
    assert.strictEqual(p.coordinates.length, 2, "polygon has two items in coordinates");
    assert.strictEqual(p.area, 48600, "polygon has correct area");
    
};

exports["test: json"] = function() {

    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var json = g.json;
    assert.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.strictEqual(obj.type, "Polygon", "correct type");
        assert.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        assert.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var g, b;
    
    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    b = g.bounds;
    
    assert.ok(b instanceof geom.Bounds, "is bounds");
    assert.deepEqual([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    g.projection = "epsg:4326";
    b = g.bounds;
    assert.ok(b instanceof geom.Bounds, "[projection] is bounds");
    assert.deepEqual([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    assert.ok(b.projection instanceof proj.Projection, "[projection] has projection");
    assert.strictEqual(b.projection.id, "EPSG:4326", "[projection] correct projection");

};

exports["test: centroid"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    var c = p.centroid;
    assert.ok(c instanceof geom.Point, "centroid is point");
    assert.ok(c.equals(new geom.Point([0, 0])), "correct centroid");

};

exports["test: clone"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var c = p.clone();
    assert.ok(c instanceof geom.Polygon, "clone is polygon");
    assert.ok(c.equals(p), "clone is equivalent to original");
    
    c.projection = "EPSG:4326";
    assert.ok(p.projection === undefined, "modifying clone doesn't modify original");
    
}

if (require.main == module.id) {
    require("test").run(exports);
}
