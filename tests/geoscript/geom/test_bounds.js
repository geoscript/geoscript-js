var assert = require("test/assert");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");

exports["test: constructor"] = function() {
    
    var bounds = new geom.Bounds();
    assert.isTrue(bounds instanceof geom.Bounds, "constructor returns instance");
    
};

exports["test: minx, miny, maxx, maxy"] = function() {
    
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    assert.is(-180, bounds.minx, "correct minx");
    assert.is(180, bounds.maxx, "correct maxx");
    assert.is(-90, bounds.miny, "correct miny");
    assert.is(90, bounds.maxy, "correct maxy");
    
};

exports["test: projection"] = function() {

    var gg = new proj.Projection("epsg:4326");
    
    // set after construction
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    assert.is(null, bounds.projection, "projection null by default");
    
    bounds.projection = gg;
    assert.isTrue(bounds.projection instanceof proj.Projection, "projection set after construction");
    assert.isTrue(bounds.projection.equals(gg), "correct projection set after construction");
    
    // with instance
    bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90,
        projection: gg
    });    
    assert.isTrue(bounds.projection instanceof proj.Projection, "projection set from instance");
    assert.isTrue(bounds.projection.equals(gg), "correct projection set from instance");
    
    // with string
    var bounds = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90,
        projection: "epsg:4326"
    });
    assert.isTrue(bounds.projection instanceof proj.Projection, "projection set from string");
    assert.isTrue(bounds.projection.equals(gg), "correct projection set from string");
    
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
    assert.isTrue(b1.equals(b3), "different bounds");
    assert.isFalse(b1.equals(b4), "different projection");
    
};

exports["test: fromArray"] = function() {
    
    var b1 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    var b2 = geom.Bounds.fromArray([-180, -90, 180, 90]);
    
    assert.isTrue(b1.equals(b2), "bounds from array is equivalent");
    
};

exports["test: toArray"] = function() {

    var b1 = new geom.Bounds({
        minx: -180, maxx: 180, miny: -90, maxy: 90
    });
    
    assert.isSame([-180, -90, 180, 90], b1.toArray(), "correct array");
    
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
    
    assert.is(259210, b2.minx | 0, "correct minx");
    assert.is(40589, b2.miny | 0, "correct miny");
    assert.is(3401247, b2.maxx | 0, "correct maxx");
    assert.is(1797356, b2.maxy | 0, "correct maxy");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
