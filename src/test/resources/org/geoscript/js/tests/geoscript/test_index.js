var assert = require("assert");
var index = require("geoscript/index");
var geom = require("geoscript/geom");

exports["test: quadtree index"] = function() {

    var quadtree = new index.QuadTree();
    quadtree.insert(new geom.Bounds([0,0,10,10]),   new geom.Point([5,5]));
    quadtree.insert(new geom.Bounds([2,2,6,6]),     new geom.Point([4,4]));
    quadtree.insert(new geom.Bounds([20,20,60,60]), new geom.Point([30,30]));
    quadtree.insert(new geom.Bounds([22,22,44,44]), new geom.Point([32,32]));
    assert.strictEqual(4, quadtree.size, "QuadTree index should have 4 entries");

    var results = quadtree.query(new geom.Bounds([1,1,5,5]));
    assert.strictEqual(4, results.length);

    var allResults = quadtree.queryAll();
    assert.strictEqual(4, allResults.length);

    var isRemoved = quadtree.remove(new geom.Bounds([22,22,44,44]), new geom.Point([32,32]));
    assert.ok(isRemoved)

    allResults = quadtree.queryAll()
    assert.strictEqual(3, allResults.length);

};

exports["test: strtree index"] = function() {

    var strtree = new index.STRtree();
    strtree.insert(new geom.Bounds([0,0,10,10]),   new geom.Point([5,5]));
    strtree.insert(new geom.Bounds([2,2,6,6]),     new geom.Point([4,4]));
    strtree.insert(new geom.Bounds([20,20,60,60]), new geom.Point([30,30]));
    strtree.insert(new geom.Bounds([22,22,44,44]), new geom.Point([32,32]));
    assert.strictEqual(4, strtree.size, "QuadTree index should have 4 entries");

};