var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports.testPoint = function() {
    
    var p = new geom.Point([1, 2]);
    
    assert.isEqual(p.x, 1);
    assert.isEqual(p.y, 2);
    
};