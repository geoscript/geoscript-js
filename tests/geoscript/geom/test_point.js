var assert = require("assert"),
    geom = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.ok(p instanceof geom.Geometry, "point is a geometry");
    assert.ok(p instanceof geom.Point, "point is a point");
    assert.equal(2, p.coordinates.length, "point has two items in coordinates");
    assert.equal(1, p.x, "correct x coordinate");
    assert.equal(2, p.y, "correct y coordinate");
    assert.ok(isNaN(p.z), "no z");
    
    var p2 = new geom.Point([1, 2, 3]);
    assert.equal(3, p2.z, "3d");
    
};

exports["test: equals"] = function() {

    var p1, p2;
    
    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([1, 2]);
    assert.ok(p1.equals(p2));
    assert.ok(p2.equals(p1));
    
    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([2, 3]);
    assert.ok(!p1.equals(p2));
    assert.ok(!p2.equals(p1));
    
    p1 = new geom.Point([1, 2, 3]);
    p2 = new geom.Point([1, 2, 3]);
    assert.ok(p1.equals(p2), "[1] 3d");
    assert.ok(p2.equals(p1), "[2] 3d");

    p1 = new geom.Point([1, 2, 3]);
    p2 = new geom.Point([1, 2, 4]);
    assert.ok(p1.equals(p2), "[1] different z");
    assert.ok(p2.equals(p1), "[2] different z");

    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([1, 2, 3]);
    assert.ok(p1.equals(p2), "2d == 3d");
    assert.ok(p2.equals(p1), "3d == 2d");

};

exports["test: json"] = function() {

    var g = new geom.Point([1, 2]);
    var json = g.json;
    assert.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.strictEqual(obj.type, "Point", "correct type");
        assert.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        assert.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: buffer"] = function() {

    var p = new geom.Point([0, 0]);
    var b = p.buffer(1);
    
    assert.ok(b instanceof geom.Polygon, "buffered point creates a polygon");
    assert.strictEqual(b.area.toFixed(2), "3.12", "almost PI");
    
    b = p.buffer(1, 24);
    assert.strictEqual(b.area.toFixed(2), "3.14", "more arc segments, higher accuracy");

};

exports["test: intersection"] = function() {
    var p1 = new geom.Point([0, 0]);
    var p2 = new geom.Point([0, 0]);
    var p3 = new geom.Point([1, 1]);
    
    var i12 = p1.intersection(p2);
    assert.ok(i12 instanceof geom.Point, "intersection is point");
    assert.ok(i12.equals(p1), "correct intersection");
    
    var i13 = p1.intersection(p3);
    assert.ok(i13.isEmpty(), "empty intersection");
    
}

exports["test: clone"] = function() {
    
    var p = new geom.Point([0, 0]);
    p.projection = "EPSG:4326";
    
    var c = p.clone();
    assert.ok(c instanceof geom.Point, "clone is point");
    assert.ok(c.equals(p), "clone equivalent to original");
    assert.ok(!!c.projection, "clone gets a projection");
    
}

if (require.main == module.id) {
    require("test").run(exports);
}
