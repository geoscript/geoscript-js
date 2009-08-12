var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports.test_Point = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.isEqual(p.x, 1);
    assert.isEqual(p.y, 2);
    
};