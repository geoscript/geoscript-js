var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var Field = require("geoscript/feature").Field;

exports["test: constructor"] = function() {
    
    var field;
    
    ASSERT.throws(function() {
        field = new Field({name: "foo"});
    }, Error, "type is required");

    ASSERT.throws(function() {
        field = new Field({type: "String"});
    }, Error, "name is required");

    ASSERT.throws(function() {
        field = new Field({name: "foo", type: "bar"});
    }, Error, "unsupported type throws error");
    
    field = new Field({
        name: "place",
        type: "String"
    });
    ASSERT.strictEqual(field.name, "place", "correct name");
    ASSERT.strictEqual(field.type, "String", "correct type");
    
    field = new Field({
        name: "place",
        type: "Point",
        projection: "EPSG:4326"
    });
    ASSERT.strictEqual(field.type, "Point", "correct type");
    ASSERT.ok(field.projection instanceof PROJ.Projection, "correct projection");
    
};

exports["test: description"] = function() {
    
    var field = new Field({name: "foo", type: "String", description: "bar"});
    ASSERT.strictEqual(field.description, "bar", "correct description");
    
};

exports["test: minOccurs"] = function() {
    
    var field;
    
    // minOccurs 0
    field = new Field({
        name: "foo",
        type: "String",
        minOccurs: 0
    });
    ASSERT.strictEqual(field.minOccurs, 0);
    ASSERT.strictEqual(field.maxOccurs, 1);

    // minOccurs 1
    field = new Field({
        name: "foo",
        type: "String",
        minOccurs: 1
    });
    ASSERT.strictEqual(field.minOccurs, 1);
    ASSERT.strictEqual(field.maxOccurs, 1);

    // minOccurs 2
    field = new Field({
        name: "foo",
        type: "String",
        minOccurs: 2
    });
    ASSERT.strictEqual(field.minOccurs, 2);
    ASSERT.strictEqual(field.maxOccurs, 2);

    // minOccurs 2, maxOccurs 3
    field = new Field({
        name: "foo",
        type: "String",
        minOccurs: 2,
        maxOccurs: 3
    });
    ASSERT.strictEqual(field.minOccurs, 2);
    ASSERT.strictEqual(field.maxOccurs, 3);

    // minOccurs unspecified
    field = new Field({
        name: "foo",
        type: "String"
    });
    ASSERT.strictEqual(field.minOccurs, 0);

};

exports["test: minOccurs (invalid)"] = function() {
    
    var field;
    
    ASSERT.throws(function() {
        field = new Field({
            name: "foo",
            type: "String",
            minOccurs: -2
        });
    }, Error, "minOccurs < -1");

    ASSERT.throws(function() {
        field = new Field({
            name: "foo",
            type: "String",
            minOccurs: 10,
            maxOccurs: 5
        });
    }, Error, "minOccurs > maxOccurs");

};


exports["test: maxOccurs"] = function() {
    
    var field;
    
    // maxOccurs 1
    field = new Field({
        name: "foo",
        type: "String",
        maxOccurs: 1
    });
    ASSERT.strictEqual(field.minOccurs, 0)
    ASSERT.strictEqual(field.maxOccurs, 1);

    // maxOccurs 2
    field = new Field({
        name: "foo",
        type: "String",
        maxOccurs: 2
    });
    ASSERT.strictEqual(field.minOccurs, 0)
    ASSERT.strictEqual(field.maxOccurs, 2);

    // maxOccurs unspecified
    field = new Field({
        name: "foo",
        type: "String"
    });
    ASSERT.strictEqual(field.maxOccurs, 1);

};

exports["test: maxOccurs (invalid)"] = function() {
    
    var field;
    
    ASSERT.throws(function() {
        field = new Field({
            name: "foo",
            type: "String",
            maxOccurs: -2
        });
    }, Error, "maxOccurs < -1");

    ASSERT.throws(function() {
        field = new Field({
            name: "foo",
            type: "String",
            minOccurs: 10,
            maxOccurs: 5
        });
    }, Error, "minOccurs > maxOccurs");

};


exports["test: getTypeName"] = function() {
    
    var getTypeName = Field.getTypeName;
    
    // valid type mapping
    ASSERT.strictEqual(getTypeName("Guatemala"), "String", "String type");
    ASSERT.strictEqual(getTypeName(100), "Integer", "Integer type");
    ASSERT.strictEqual(getTypeName(1.0), "Number", "Number type");
    ASSERT.strictEqual(getTypeName(new GEOM.Point([1, 2])), "Point", "point type");
    
    // no type mapping
    ASSERT.strictEqual(getTypeName(null), null, "null");
    ASSERT.strictEqual(getTypeName([]), null, "Array");
    ASSERT.strictEqual(getTypeName({}), null, "Object");
    ASSERT.strictEqual(getTypeName(), null, "undefined");
    ASSERT.strictEqual(getTypeName(new Date()), "Datetime", "Date");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
