var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports["test: LineString"] = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.isTrue(l instanceof geom.Geometry, "line is a geometry");
    assert.isTrue(l instanceof geom.LineString, "line is a line");
    assert.is(3, l.coordinates.length, "line has three coordinates");
    assert.is(402.49223594996215, l.length, "line has correct length");
    
};

exports["test: LineString.wkt"] = function() {

    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    assert.is("LINESTRING (-180 -90, 0 0, 180 90)", l.wkt, "correct wkt");

};


if (require.main === module.id) {
    require("test/runner").run(exports);
}