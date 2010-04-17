var ASSERT = require("test/assert");
var GEOM = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var geometry = new GEOM.GeometryCollection();
    ASSERT.isTrue(geometry instanceof GEOM.Geometry, "collection is geometry");
    ASSERT.isTrue(geometry instanceof GEOM.GeometryCollection, "correct type");
    
};

exports["test: isEmpty"] = function() {
    
    var geometry = new GEOM.GeometryCollection([]);
    ASSERT.isTrue(geometry.isEmpty(), "empty collection");
    
}

if (require.main == module) {
    require("test/runner").run(exports);
}
