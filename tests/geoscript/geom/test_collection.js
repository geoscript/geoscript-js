var ASSERT = require("assert");
var GEOM = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var geometry = new GEOM.GeometryCollection();
    ASSERT.ok(geometry instanceof GEOM.Geometry, "collection is geometry");
    ASSERT.ok(geometry instanceof GEOM.GeometryCollection, "correct type");
    
};

exports["test: isEmpty"] = function() {
    
    var geometry = new GEOM.GeometryCollection([]);
    ASSERT.ok(geometry.empty, "empty collection");
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
