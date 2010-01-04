var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    
    assert.isTrue(l instanceof geom.Geometry, "line is a geometry");
    assert.isTrue(l instanceof geom.LineString, "line is a line");
    assert.is(3, l.coordinates.length, "line has three coordinates");
    assert.is(402.49223594996215, l.length, "line has correct length");
    
};

exports["test: wkt"] = function() {

    var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    assert.is("LINESTRING (-180 -90, 0 0, 180 90)", l.wkt, "correct wkt");

};

exports["test: json"] = function() {

    var g = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    var json = g.json;
    assert.is("string", typeof json, "json is string");
    var obj, msg;
    try {
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("LineString", obj.type, "correct type");
        assert.isSame(g.coordinates, obj.coordinates, "correct coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}