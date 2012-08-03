var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var FEATURE = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var field;
    
    ASSERT.throws(function() {
        field = new FEATURE.Field({name: "foo"});
    }, Error, "type is required");

    ASSERT.throws(function() {
        field = new FEATURE.Field({type: "String"});
    }, Error, "name is required");

    ASSERT.throws(function() {
        field = new FEATURE.Field({name: "foo", type: "bar"});
    }, Error, "unsupported type throws error");
    
    field = new FEATURE.Field({
        name: "place",
        type: "String"
    });
    ASSERT.strictEqual(field.name, "place", "correct name");
    ASSERT.strictEqual(field.type, "String", "correct type");
    
    field = new FEATURE.Field({
        name: "place",
        type: "Point",
        projection: "EPSG:4326"
    });
    ASSERT.strictEqual(field.type, "Point", "correct type");
    ASSERT.ok(field.projection instanceof PROJ.Projection, "correct projection");
    
};

exports["test: title"] = function() {
    
    var field = new FEATURE.Field({name: "foo", type: "String", title: "Foo"});
    ASSERT.strictEqual(field.title, "Foo", "correct title");
    
};

exports["test: description"] = function() {
    
    var field = new FEATURE.Field({name: "foo", type: "String", description: "bar"});
    ASSERT.strictEqual(field.description, "bar", "correct description");
    
};

exports["test: getTypeName"] = function() {
    
    var getTypeName = FEATURE.Field.getTypeName;
    
    // valid type mapping
    ASSERT.strictEqual(getTypeName("Guatemala"), "String", "String type");
    ASSERT.strictEqual(getTypeName(100), "Integer", "Integer type");
    ASSERT.strictEqual(getTypeName(1.0), "Double", "Double type");
    ASSERT.strictEqual(getTypeName(new GEOM.Point([1, 2])), "Point", "point type");
    
    // no type mapping
    ASSERT.strictEqual(getTypeName(null), null, "null");
    ASSERT.strictEqual(getTypeName([]), null, "Array");
    ASSERT.strictEqual(getTypeName({}), null, "Object");
    ASSERT.strictEqual(getTypeName(), null, "undefined");
    ASSERT.strictEqual(getTypeName(new Date()), null, "Date");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
