var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
var FEATURE = require("geoscript/feature");

var geotools = Packages.org.geotools;
var CRS = geotools.referencing.CRS;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var NameImpl = geotools.feature.NameImpl;
var jts = Packages.com.vividsolutions.jts;

exports["test: constructor"] = function() {
    
    var fields = [
        {name: "floors", type: "Integer"},
        {name: "address", type: "String"},
        {name: "footprint", type: "Polygon"}
    ];

    var schema = new FEATURE.Schema({
        name: "building",
        fields: fields
    });
    
    ASSERT.strictEqual(schema.fields.length, 3, "correct number of fields");
    for (var i=0; i<fields.length; ++i) {
        ASSERT.deepEqual(schema.fields[i].type, fields[i].type, "correct field type for " + i);
        ASSERT.deepEqual(schema.fields[i].name, fields[i].name, "correct field name for " + i);
    }
    
    ASSERT.strictEqual(schema.geometry.name, "footprint", "correct geometry name");
    ASSERT.strictEqual(schema.geometry.type, "Polygon", "correct geometry type");
    

};

exports["test: fields"] = function() {

    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var fields = schema.fields;
    
    ASSERT.ok(fields instanceof Array, "fields is array");
    ASSERT.strictEqual(fields.length, 3, "correct fields length");
    ASSERT.strictEqual(fields[0].name, "name", "correct name for first field");
    ASSERT.strictEqual(fields[0].type, "String", "correct type for first field");
    ASSERT.strictEqual(fields[1].name, "location", "correct name for second field");
    ASSERT.strictEqual(fields[1].type, "Point", "correct type for second field");
    ASSERT.ok(fields[1].projection instanceof PROJ.Projection, "geometry field has projection instance");
    ASSERT.strictEqual(fields[1].projection.id, "EPSG:4326", "geometry field has correct projection id");
    ASSERT.strictEqual(fields[2].name, "population", "correct name for third field");
    ASSERT.strictEqual(fields[2].type, "Integer", "correct type for third field");
    
};

exports["test: fieldNames"] = function() {

    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var names = schema.fieldNames;    
    ASSERT.ok(names instanceof Array, "fieldNames is array");
    ASSERT.deepEqual(["location", "name", "population"], names.sort(), "correct names");

};

exports["test: get"] = function() {

    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var def = schema.get("name");
    ASSERT.ok(!!def, "got field named 'name'");
    ASSERT.strictEqual(def.name, "name", "correct name for 'name' field");
    ASSERT.strictEqual(def.type, "String", "correct type for 'name' field");
    
    def = schema.get("location");
    ASSERT.ok(!!def, "got field named 'location'");
    ASSERT.strictEqual(def.name, "location", "correct name for 'location' field");
    ASSERT.strictEqual(def.type, "Point", "correct type for 'location' field");
    ASSERT.ok(def.projection instanceof PROJ.Projection, "'location' field has projection instance");
    
};

exports["test: geometry"] = function() {

    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    ASSERT.strictEqual(schema.geometry.name, "location", "correct geometry name");
    ASSERT.strictEqual(schema.geometry.type, "Point", "correct geometry type");
    ASSERT.ok(schema.geometry.projection instanceof PROJ.Projection, "correct geometry.projection type");
    ASSERT.strictEqual(schema.geometry.projection.id, "EPSG:4326", "correct geometry.projection id");

};

exports["test: clone"] = function() {

    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var clone = schema.clone();
    
    ASSERT.ok(clone instanceof FEATURE.Schema, "clone is a Schema");
    ASSERT.deepEqual(clone.fieldNames, schema.fieldNames, "clone has same field names");
    ASSERT.strictEqual(clone.name, schema.name, "clone gets same name by default");
    
    var clone2 = schema.clone({name: "foo"});
    ASSERT.strictEqual(clone2.name, "foo", "clone can be assigned a new name");
    
    var clone3 = schema.clone({
        fields: [
            {name: "location", type: "Polygon", projection: "epsg:4326"},
            {name: "newField", type: "String"}
        ]
    });
    
    ASSERT.deepEqual(["name", "location", "population", "newField"], clone3.fieldNames, "clone extended with new field");
    ASSERT.strictEqual(clone3.get("location").type, "Polygon", "clone given updated field config");

};

exports["test: _schema"] = function() {
    
    var schema = new FEATURE.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });    
    var _schema = schema._schema;
    
    ASSERT.ok(_schema instanceof geotools.feature.simple.SimpleFeatureTypeImpl, "_schema of correct type");
    ASSERT.strictEqual(_schema.getAttributeCount(), 3, "correct number of attributes");
    
    // test geometry
    var geomDesc = _schema.getGeometryDescriptor();
    ASSERT.strictEqual(String(geomDesc.getLocalName()), "location", "correct geometry name");
    ASSERT.ok(geomDesc.type.getBinding() === jts.geom.Point, "correct geometry type");
    var crs = geomDesc.getCoordinateReferenceSystem();
    ASSERT.strictEqual(String(CRS.lookupIdentifier(crs, true)), "EPSG:4326", "correct geometry crs");
    
};

exports["test: fromValues"] = function() {
    
    var values = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100
    };
    var schema = FEATURE.Schema.fromValues(values);
    
    ASSERT.ok(schema instanceof FEATURE.Schema, "correct type");    

    // test field names
    ASSERT.deepEqual(["location", "name", "population"], schema.fieldNames.sort(), "correct fieldNames");

    // test field types
    ASSERT.deepEqual(schema.get("location").type, "Point", "correct location type");
    ASSERT.deepEqual(schema.get("name").type, "String", "correct name type");
    ASSERT.deepEqual(schema.get("population").type, "Double", "correct population type");

    // test geometry
    ASSERT.strictEqual(schema.geometry.name, "location", "correct geometry name");
    ASSERT.strictEqual(schema.geometry.type, "Point", "correct geometry type");
    
};

exports["test: from_"] = function() {

    var builder = new SimpleFeatureTypeBuilder();
    builder.setName(new NameImpl("test"));
    builder.add("name", java.lang.String);
    builder.add("population", java.lang.Integer);
    builder.crs(CRS.decode("epsg:4326"));
    builder.add("location", jts.geom.Point);
    var _schema = builder.buildFeatureType();
    var schema = FEATURE.Schema.from_(_schema);

    ASSERT.ok(schema instanceof FEATURE.Schema, "schema of correct type");
    ASSERT.strictEqual(schema.name, "test", "correct schema name");
    ASSERT.strictEqual(schema.fields.length, 3, "correct number of fields");
    
    // test fields array
    ASSERT.strictEqual(schema.fields[0].name, "name", "correct name for first field");
    ASSERT.strictEqual(schema.fields[0].type, "String", "correct type for first field");
    ASSERT.strictEqual(schema.fields[1].name, "population", "correct name for second field");
    ASSERT.strictEqual(schema.fields[1].type, "Integer", "correct type for second field"); 
    ASSERT.strictEqual(schema.fields[2].name, "location", "correct name for third field");
    ASSERT.strictEqual(schema.fields[2].type, "Point", "correct type for third field");
    
    // test geometry
    ASSERT.strictEqual(schema.geometry.name, "location", "correct name for geometry");
    ASSERT.strictEqual(schema.geometry.type, "Point", "correct type for geometry");
    ASSERT.ok(schema.geometry.projection instanceof PROJ.Projection, "correct type for geometry crs");
    ASSERT.strictEqual(schema.geometry.projection.id, "EPSG:4326", "correct code for geometry crs");    
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
