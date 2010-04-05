var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.isTrue(p instanceof geom.Geometry, "point is a geometry");
    assert.isTrue(p instanceof geom.Point, "point is a point");
    assert.isEqual(2, p.coordinates.length, "point has two items in coordinates");
    assert.isEqual(1, p.x, "correct x coordinate");
    assert.isEqual(2, p.y, "correct y coordinate");
    assert.isTrue(isNaN(p.z), "no z");
    
    var p2 = new geom.Point([1, 2, 3]);
    assert.isEqual(3, p2.z, "3d");
    
};

exports["test: equals"] = function() {

    var p1, p2;
    
    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([1, 2]);
    assert.isTrue(p1.equals(p2));
    assert.isTrue(p2.equals(p1));
    
    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([2, 3]);
    assert.isTrue(!p1.equals(p2));
    assert.isTrue(!p2.equals(p1));
    
    p1 = new geom.Point([1, 2, 3]);
    p2 = new geom.Point([1, 2, 3]);
    assert.isTrue(p1.equals(p2), "[1] 3d");
    assert.isTrue(p2.equals(p1), "[2] 3d");

    p1 = new geom.Point([1, 2, 3]);
    p2 = new geom.Point([1, 2, 4]);
    assert.isTrue(p1.equals(p2), "[1] different z");
    assert.isTrue(p2.equals(p1), "[2] different z");

    p1 = new geom.Point([1, 2]);
    p2 = new geom.Point([1, 2, 3]);
    assert.isTrue(p1.equals(p2), "2d == 3d");
    assert.isTrue(p2.equals(p1), "3d == 2d");

};

exports["test: json"] = function() {

    var g = new geom.Point([1, 2]);
    var json = g.json;
    assert.is("string", typeof json, "json is string");
    var obj, msg;
    try {
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("Point", obj.type, "correct type");
        assert.isSame(g.coordinates, obj.coordinates, "correct coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
};

exports["test: buffer"] = function() {

    var p = new geom.Point([0, 0]);
    var b = p.buffer(1);
    
    assert.isTrue(b instanceof geom.Polygon, "buffered point creates a polygon");
    assert.is("3.12", b.area.toFixed(2), "almost PI");
    
    b = p.buffer(1, 24);
    assert.is("3.14", b.area.toFixed(2), "more arc segments, higher accuracy");

};

if (require.main == module) {
    require("test/runner").run(exports);
}
