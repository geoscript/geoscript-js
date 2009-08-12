var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports.test_Point = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.isTrue(p instanceof geom.Geometry, "point is a geometry");
    assert.isTrue(p instanceof geom.Point, "point is a point");
    assert.isEqual(2, p.coordinates.length, "point has two items in coordinates");
    assert.isEqual(1, p.x, "correct x coordinate");
    assert.isEqual(2, p.y, "correct y coordinate");
    
};

exports.test_LineString = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.isTrue(l instanceof geom.Geometry, "line is a geometry");
    assert.isTrue(l instanceof geom.LineString, "line is a line");
    assert.isEqual(3, l.coordinates.length, "line has three coordinates");
    assert.isEqual(402.49223594996215, l.length, "line has correct length");
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}