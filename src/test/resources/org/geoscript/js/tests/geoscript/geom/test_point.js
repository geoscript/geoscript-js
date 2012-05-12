var ASSERT = require("assert");
var GEOM = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var p = new GEOM.Point([1, 2]);
    
    ASSERT.ok(p instanceof GEOM.Geometry, "point is a geometry");
    ASSERT.ok(p instanceof GEOM.Point, "point is a point");
    ASSERT.equal(2, p.coordinates.length, "point has two items in coordinates");
    ASSERT.equal(1, p.x, "correct x coordinate");
    ASSERT.equal(2, p.y, "correct y coordinate");
    ASSERT.ok(isNaN(p.z), "no z");
    
    var p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.equal(3, p2.z, "3d");

    var p3 = GEOM.Point([1, 2, 3]);
    ASSERT.ok(p3.equals(p2), "newless construction");
    
};

exports["test: index"] = function() {
    var p = new GEOM.Point([10, 20]);
    ASSERT.equal(p[0], 10, "index 0");
    ASSERT.equal(p[1], 20, "index 1");
    ASSERT.ok(isNaN(p[2]), "index 2");
    
    var zp = new GEOM.Point([10, 20, 30]);
    ASSERT.equal(zp[2], 30, "3d");
}

exports["test: equals"] = function() {

    var p1, p2;
    
    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([1, 2]);
    ASSERT.ok(p1.equals(p2));
    ASSERT.ok(p2.equals(p1));
    
    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([2, 3]);
    ASSERT.ok(!p1.equals(p2));
    ASSERT.ok(!p2.equals(p1));
    
    p1 = new GEOM.Point([1, 2, 3]);
    p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.ok(p1.equals(p2), "[1] 3d");
    ASSERT.ok(p2.equals(p1), "[2] 3d");

    p1 = new GEOM.Point([1, 2, 3]);
    p2 = new GEOM.Point([1, 2, 4]);
    ASSERT.ok(p1.equals(p2), "[1] different z");
    ASSERT.ok(p2.equals(p1), "[2] different z");

    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.ok(p1.equals(p2), "2d == 3d");
    ASSERT.ok(p2.equals(p1), "3d == 2d");

};

exports["test: json"] = function() {

    var g = new GEOM.Point([1, 2]);
    var json = g.json;
    ASSERT.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "Point", "correct type");
        ASSERT.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: dimension"] = function() {

    var g = new GEOM.Point([1, 2]);
    ASSERT.strictEqual(g.dimension, 0, "correct dimension");

};

exports["test: buffer"] = function() {

    var p = new GEOM.Point([0, 0]);
    var b = p.buffer(1);
    
    ASSERT.ok(b instanceof GEOM.Polygon, "buffered point creates a polygon");
    ASSERT.strictEqual(b.area.toFixed(2), "3.12", "almost PI");
    
    b = p.buffer(1, {segs: 24});
    ASSERT.strictEqual(b.area.toFixed(2), "3.14", "more arc segments, higher accuracy");

};

exports["test: intersection"] = function() {
    var p1 = new GEOM.Point([0, 0]);
    var p2 = new GEOM.Point([0, 0]);
    var p3 = new GEOM.Point([1, 1]);
    
    var i12 = p1.intersection(p2);
    ASSERT.ok(i12 instanceof GEOM.Point, "intersection is point");
    ASSERT.ok(i12.equals(p1), "correct intersection");
    
    var i13 = p1.intersection(p3);
    ASSERT.ok(i13.empty, "empty intersection");
    
}

exports["test: clone"] = function() {
    
    var p = new GEOM.Point([0, 0]);
    p.projection = "EPSG:4326";
    
    var c = p.clone();
    ASSERT.ok(c instanceof GEOM.Point, "clone is point");
    ASSERT.ok(c.equals(p), "clone equivalent to original");
    ASSERT.ok(!!c.projection, "clone gets a projection");
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
