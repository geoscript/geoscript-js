var ASSERT = require("test/assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var FEATURE = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var field;
    
    field = new FEATURE.Field();
    ASSERT.isTrue(field instanceof FEATURE.Field, "correct instance");
    
    ASSERT.throwsError(function() {
        field = new FEATURE.Field({name: "foo"});
    }, Error, "type is required");

    ASSERT.throwsError(function() {
        field = new FEATURE.Field({type: "String"});
    }, Error, "name is required");

    ASSERT.throwsError(function() {
        field = new FEATURE.Field({type: "foo"});
    }, Error, "unsupported type throws error");
    
    field = new FEATURE.Field({
        name: "place",
        type: "String"
    });
    ASSERT.isSame("place", field.name, "correct name");
    ASSERT.isSame("String", field.type, "correct type");
    
    field = new FEATURE.Field({
        name: "place",
        type: "Point",
        projection: "EPSG:4326"
    });
    ASSERT.isSame("Point", field.type, "correct type");
    ASSERT.isTrue(field.projection instanceof PROJ.Projection, "correct projection");
    
};

exports["test: fromValue"] = function() {
    
    var field;
    
    field = FEATURE.Field.fromValue("place", "Guatemala");
    ASSERT.isSame("place", field.name, "correct name");
    ASSERT.isSame("String", field.type, "correct type");

    field = FEATURE.Field.fromValue("pop", 100);
    ASSERT.isSame("pop", field.name, "correct name");
    ASSERT.isSame("Double", field.type, "correct type");

    field = FEATURE.Field.fromValue("loc", new GEOM.Point([1, 2]));
    ASSERT.isSame("loc", field.name, "correct name");
    ASSERT.isSame("Point", field.type, "correct type");    
    
};

if (require.main == module) {
    require("test/runner").run(exports);
}
