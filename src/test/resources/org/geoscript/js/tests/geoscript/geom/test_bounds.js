var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var bounds = new GEOM.Bounds([0, 0, 0, 0]);
    ASSERT.ok(bounds instanceof GEOM.Bounds, "constructor returns instance");
    
};

exports["test: minX, minY, maxX, maxY"] = function() {
    
    var bounds = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    
    ASSERT.strictEqual(bounds.minX, -180, "correct minX");
    ASSERT.strictEqual(bounds.maxX, 180, "correct maxX");
    ASSERT.strictEqual(bounds.minY, -90, "correct minY");
    ASSERT.strictEqual(bounds.maxY, 90, "correct maxY");
    
};

exports["test: projection"] = function() {

    var gg = new PROJ.Projection("epsg:4326");
    
    // set after construction
    var bounds = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    ASSERT.strictEqual(bounds.projection, null, "projection null by default");
    
    bounds.projection = gg;
    ASSERT.ok(bounds.projection instanceof PROJ.Projection, "projection set after construction");
    ASSERT.ok(bounds.projection.equals(gg), "correct projection set after construction");
    
    // with instance
    bounds = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90,
        projection: gg
    });    
    ASSERT.ok(bounds.projection instanceof PROJ.Projection, "projection set from instance");
    ASSERT.ok(bounds.projection.equals(gg), "correct projection set from instance");
    
    // with string
    var bounds = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90,
        projection: "epsg:4326"
    });
    ASSERT.ok(bounds.projection instanceof PROJ.Projection, "projection set from string");
    ASSERT.ok(bounds.projection.equals(gg), "correct projection set from string");
    
};

exports["test: equals"] = function() {
    
    var b1 = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    
    var b2 = new GEOM.Bounds({
        minX: -160, maxX: 180, minY: -90, maxY: 90
    });
    
    var b3 = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    
    var b4 = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90, projection: "epsg:4326"
    });
    
    ASSERT.isFalse(b1.equals(b2), "different bounds");
    ASSERT.ok(b1.equals(b3), "same bounds");
    ASSERT.isFalse(b1.equals(b4), "different projection");
    
};

exports["test: include"] = function() {
    
    var b1 = new GEOM.Bounds({
        minX: -10, maxX: 10, minY: -9, maxY: 9
    });
    
    var b2 = new GEOM.Bounds({
        minX: -11, maxX: 9, minY: -8, maxY: 10
    });
    
    var point = new GEOM.Point([20, 0]);
    
    var line = new GEOM.LineString([[0, 0], [20, 20]]);
    
    var r = b1.include(b2);
    ASSERT.ok(r === b1, "include returns the bounds");
    ASSERT.deepEqual([-11, -9, 10, 10], b1.toArray(), "include bounds works");

    // TODO: accept geometry
//    b1.include(point);
//    ASSERT.deepEqual([-11, -9, 20, 10], b1.toArray(), "include point works");
//    
//    b1.include(line);
//    ASSERT.deepEqual([-11, -9, 20, 20], b1.toArray(), "include line works");
    
};

exports["test: intersects"] = function() {

    var b = new GEOM.Bounds({
        minX: -10, maxX: 10, minY: -5, maxY: 5
    });
    
    var inside = new GEOM.Bounds({
        minX: -5, maxX: 5, minY: -2, maxY: 2
    });
    
    var touching1 = new GEOM.Bounds({
        minX: -10, maxX: 5, minY: -2, maxY: 5
    });

    var touching2 = new GEOM.Bounds({
        minX: 10, maxX: 15, minY: -5, maxY: 5
    });
    
    var intersecting = new GEOM.Bounds({
        minX: 0, maxX: 20, minY: 0, maxY: 10
    });
    
    var outside = new GEOM.Bounds({
        minX: 50, maxX: 60, minY: 50, maxY: 50
    });
    
    ASSERT.ok(b.intersects(inside), "inside");
    ASSERT.ok(inside.intersects(b), "r:inside");
    ASSERT.ok(b.intersects(touching1), "touching inside");
    ASSERT.ok(touching1.intersects(b), "r:touching inside");
    ASSERT.ok(b.intersects(touching2), "touching edges");
    ASSERT.ok(touching1.intersects(b), "r:touching edges");
    ASSERT.ok(b.intersects(intersecting), "intersecting");
    ASSERT.ok(intersecting.intersects(b), "r:intersecting");
    ASSERT.isFalse(b.intersects(outside), "outside");
    ASSERT.isFalse(outside.intersects(b), "r:outside");
    
    // TODO: accept geometry
//    ASSERT.ok(b.intersects(new GEOM.LineString([[0, 0], [2, 2]])), "inside line");
//    ASSERT.ok(b.intersects(new GEOM.LineString([[0, 0], [20, 20]])), "intersecting line");
//    ASSERT.ok(b.intersects(new GEOM.LineString([[10, 0], [20, 0]])), "touching line");
//    ASSERT.isFalse(b.intersects(new GEOM.LineString([[15, 15], [20, 20]])), "outside line");
    
};

exports["test: intersection"] = function() {
    
    var b1 = new GEOM.Bounds([0, 0, 10, 10]);
    var b2 = new GEOM.Bounds([5, 5, 20, 20]);
    var b3 = new GEOM.Bounds([20, 20, 30, 30]);
    
    var r = b1.intersection(b2);
    ASSERT.deepEqual([5, 5, 10, 10], r.toArray(), "correct intersection");
    
    r = b1.intersection(b3);
    ASSERT.ok(r.empty, "empty intersection");
    
};

exports["test: contains"] = function() {
    
    var b = new GEOM.Bounds({
        minX: -10, maxX: 10, minY: -5, maxY: 5
    });
    
    var inside = new GEOM.Bounds({
        minX: -5, maxX: 5, minY: -2, maxY: 2
    });
    
    var touching = new GEOM.Bounds({
        minX: -10, maxX: 5, minY: -2, maxY: 5
    });
    
    var intersecting = new GEOM.Bounds({
        minX: 0, maxX: 20, minY: 0, maxY: 10
    });
    
    var outside = new GEOM.Bounds({
        minX: 50, maxX: 60, minY: 50, maxY: 50
    });
    
    ASSERT.ok(b.contains(inside), "inside");
    ASSERT.ok(b.contains(touching), "touching");
    ASSERT.isFalse(b.contains(intersecting), "intersecting");
    ASSERT.isFalse(b.contains(outside), "outside");
    
    // TODO: accept geometries
//    ASSERT.ok(b.contains(new GEOM.LineString([[0, 0], [2, 2]])), "inside line");
//    ASSERT.isFalse(b.contains(new GEOM.LineString([[0, 0], [20, 20]])), "intersecting line");
    
};

exports["test: clone"] = function() {
    
    var b = new GEOM.Bounds({
        minX: -150, maxX: 160, minY: -60, maxY: 50, projection: "epsg:4326"
    });
    
    var c = b.clone();
    
    ASSERT.ok(c instanceof GEOM.Bounds, "clone is bounds");
    ASSERT.ok(c.equals(b), "clone is equivalent to original");
    
    b.include(new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90, projection: "epsg:4326"
    }));
    
    ASSERT.isFalse(c.equals(b), "modifying original doesn't modify clone");
    
};


exports["test: fromArray"] = function() {
    
    var b1 = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    
    var b2 = new GEOM.Bounds([-180, -90, 180, 90]);
    
    ASSERT.strictEqual(b1.equals(b2), true, "bounds from array is equivalent");
    
};

exports["test: toArray"] = function() {

    var b1 = new GEOM.Bounds({
        minX: -180, maxX: 180, minY: -90, maxY: 90
    });
    
    ASSERT.deepEqual(b1.toArray(), [-180, -90, 180, 90], "correct array");
    
};

exports["test: transform"] = function() {
    
    var gg = new PROJ.Projection("epsg:4326");
    var mt = new PROJ.Projection("epsg:2256");
    
    var bounds = new GEOM.Bounds([
        -116.0400, 44.3600, -104.0200, 49.0000 
    ]);
    bounds.projection = gg;
    
    var b2 = bounds.transform(mt);
    //259210.89459448296,40589.91024867553,3401247.9728652285,1797356.1848749956
    
    ASSERT.strictEqual(b2.minX | 0, 259212, "correct minX");
    ASSERT.strictEqual(b2.minY | 0, 40590, "correct minY");
    ASSERT.strictEqual(b2.maxX | 0, 3401250, "correct maxX");
    ASSERT.strictEqual(b2.maxY | 0, 1797357, "correct maxY");
    
};

exports["test: empty"] = function() {
    
    var b1 = new GEOM.Bounds({
        minX: -10, minY: -20, maxX: 10, maxY: -10
    });
    var b2 = new GEOM.Bounds({
        minX: -10, minY: 0, maxX: 10, maxY: 20
    });
    
    // b1 doesn't intersect b2
    var b3 = b1.intersection(b2);
    ASSERT.strictEqual(b3.empty, true, "empty intersection");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
