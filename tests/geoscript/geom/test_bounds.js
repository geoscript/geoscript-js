var assert = require("assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var bounds = new geom.Bounds();
    assert.ok(bounds instanceof geom.Bounds, "constructor returns instance");
    
};

exports["test: minx, miny, maxx, maxy"] = function() {
    
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    assert.strictEqual(bounds.minx, -180, "correct minx");
    assert.strictEqual(bounds.maxx, 180, "correct maxx");
    assert.strictEqual(bounds.miny, -90, "correct miny");
    assert.strictEqual(bounds.maxy, 90, "correct maxy");
    
};

exports["test: projection"] = function() {

    var gg = new proj.Projection("epsg:4326");
    
    // set after construction
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    assert.strictEqual(bounds.projection, null, "projection null by default");
    
    bounds.projection = gg;
    assert.ok(bounds.projection instanceof proj.Projection, "projection set after construction");
    assert.ok(bounds.projection.equals(gg), "correct projection set after construction");
    
    // with instance
    bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90,
        projection: gg
    });    
    assert.ok(bounds.projection instanceof proj.Projection, "projection set from instance");
    assert.ok(bounds.projection.equals(gg), "correct projection set from instance");
    
    // with string
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90,
        projection: "epsg:4326"
    });
    assert.ok(bounds.projection instanceof proj.Projection, "projection set from string");
    assert.ok(bounds.projection.equals(gg), "correct projection set from string");
    
};

exports["test: equals"] = function() {
    
    var b1 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    var b2 = new geom.Bounds({
        minx: -160, maxx: 180, miny: -90, maxy: 90
    });
    
    var b3 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    var b4 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
    });
    
    assert.isFalse(b1.equals(b2), "same bounds");
    assert.ok(b1.equals(b3), "different bounds");
    assert.isFalse(b1.equals(b4), "different projection");
    
};

exports["test: include"] = function() {
    
    var b1 = new geom.Bounds({
        minx: -10, maxx: 10, miny: -9, maxy: 9
    });
    
    var b2 = new geom.Bounds({
        minx: -11, maxx: 9, miny: -8, maxy: 10
    });
    
    var point = new geom.Point([20, 0]);
    
    var line = new geom.LineString([[0, 0], [20, 20]]);
    
    var r = b1.include(b2);
    assert.ok(r === b1, "include returns the bounds");
    assert.deepEqual([-11, -9, 10, 10], b1.toArray(), "include bounds works");
    
    b1.include(point);
    assert.deepEqual([-11, -9, 20, 10], b1.toArray(), "include point works");
    
    b1.include(line);
    assert.deepEqual([-11, -9, 20, 20], b1.toArray(), "include line works");
    
};

exports["test: intersects"] = function() {

    var b = new geom.Bounds({
        minx: -10, maxx: 10, miny: -5, maxy: 5
    });
    
    var inside = new geom.Bounds({
        minx: -5, maxx: 5, miny: -2, maxy: 2
    });
    
    var touching1 = new geom.Bounds({
        minx: -10, maxx: 5, miny: -2, maxy: 5
    });

    var touching2 = new geom.Bounds({
        minx: 10, maxx: 15, miny: -5, maxy: 5
    });
    
    var intersecting = new geom.Bounds({
        minx: 0, maxx: 20, miny: 0, maxy: 10
    });
    
    var outside = new geom.Bounds({
        minx: 50, maxx: 60, miny: 50, maxy: 50
    });
    
    assert.ok(b.intersects(inside), "inside");
    assert.ok(inside.intersects(b), "r:inside");
    assert.ok(b.intersects(touching1), "touching inside");
    assert.ok(touching1.intersects(b), "r:touching inside");
    assert.ok(b.intersects(touching2), "touching edges");
    assert.ok(touching1.intersects(b), "r:touching edges");
    assert.ok(b.intersects(intersecting), "intersecting");
    assert.ok(intersecting.intersects(b), "r:intersecting");
    assert.isFalse(b.intersects(outside), "outside");
    assert.isFalse(outside.intersects(b), "r:outside");
    
    assert.ok(b.intersects(geom.create([[0, 0], [2, 2]])), "inside line");
    assert.ok(b.intersects(geom.create([[0, 0], [20, 20]])), "intersecting line");
    assert.ok(b.intersects(geom.create([[10, 0], [20, 0]])), "touching line");
    assert.isFalse(b.intersects(geom.create([[15, 15], [20, 20]])), "outside line");
    
};

exports["test: intersection"] = function() {
    
    var b1 = geom.Bounds.fromArray([0, 0, 10, 10]);
    var b2 = geom.Bounds.fromArray([5, 5, 20, 20]);
    var b3 = geom.Bounds.fromArray([20, 20, 30, 30]);
    
    var r = b1.intersection(b2);
    assert.deepEqual([5, 5, 10, 10], r.toArray(), "correct intersection");
    
    r = b1.intersection(b3);
    assert.ok(r.empty, "empty intersection");
    
};

exports["test: contains"] = function() {
    
    var b = new geom.Bounds({
        minx: -10, maxx: 10, miny: -5, maxy: 5
    });
    
    var inside = new geom.Bounds({
        minx: -5, maxx: 5, miny: -2, maxy: 2
    });
    
    var touching = new geom.Bounds({
        minx: -10, maxx: 5, miny: -2, maxy: 5
    });
    
    var intersecting = new geom.Bounds({
        minx: 0, maxx: 20, miny: 0, maxy: 10
    });
    
    var outside = new geom.Bounds({
        minx: 50, maxx: 60, miny: 50, maxy: 50
    });
    
    assert.ok(b.contains(inside), "inside");
    assert.ok(b.contains(touching), "touching");
    assert.isFalse(b.contains(intersecting), "intersecting");
    assert.isFalse(b.contains(outside), "outside");
    
    assert.ok(b.contains(geom.create([[0, 0], [2, 2]])), "inside line");
    assert.isFalse(b.contains(geom.create([[0, 0], [20, 20]])), "intersecting line");
    
};

exports["test: clone"] = function() {
    
    var b = new geom.Bounds({
        minx: -150, maxx: 160, miny: -60, maxy: 50, projection: "epsg:4326"
    });
    
    var c = b.clone();
    
    assert.ok(c instanceof geom.Bounds, "clone is bounds");
    assert.ok(c.equals(b), "clone is equivalent to original");
    
    b.include(new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
    }));
    
    assert.isFalse(c.equals(b), "modifying original doesn't modify clone");
    
};


exports["test: fromArray"] = function() {
    
    var b1 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    var b2 = geom.Bounds.fromArray([-180, -90, 180, 90]);
    
    assert.ok(b1.equals(b2), "bounds from array is equivalent");
    
};

exports["test: toArray"] = function() {

    var b1 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    assert.deepEqual([-180, -90, 180, 90], b1.toArray(), "correct array");
    
};

exports["test: transform"] = function() {
    
    var gg = new proj.Projection("epsg:4326");
    var mt = new proj.Projection("epsg:2256");
    
    var bounds = geom.Bounds.fromArray([
        -116.0400, 44.3600, -104.0200, 49.0000 
    ]);
    bounds.projection = gg;
    
    var b2 = bounds.transform(mt);
    //259210.89459448296,40589.91024867553,3401247.9728652285,1797356.1848749956
    
    assert.strictEqual(b2.minx | 0, 259210, "correct minx");
    assert.strictEqual(b2.miny | 0, 40589, "correct miny");
    assert.strictEqual(b2.maxx | 0, 3401247, "correct maxx");
    assert.strictEqual(b2.maxy | 0, 1797356, "correct maxy");
    
};

exports["test: empty"] = function() {
    
    var b1 = new geom.Bounds({
        minx: -10, miny: -20, maxx: 10, maxy: -10
    });
    var b2 = new geom.Bounds({
        minx: -10, miny: 0, maxx: 10, maxy: 20
    });
    
    // b1 doesn't intersect b2
    var b3 = b1.intersection(b2);
    assert.ok(b3.empty, "empty intersection");
    
    // create an empty bounds with no projection
    var empty1 = new geom.Bounds({});
    assert.ok(empty1.empty, "constructed empty with no projection");
    assert.strictEqual(empty1.projection, null, "empty bounds with null projection");

    // create an empty bounds with projection
    var empty2 = new geom.Bounds({projection: "epsg:4326"});
    assert.ok(empty2.empty, "constructed empty with projection");
    assert.ok(empty2.projection instanceof proj.Projection, "constructed empty with projection");
        
};

if (require.main == module.id) {
    require("test").run(exports);
}
