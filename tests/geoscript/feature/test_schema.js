var assert = require("assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj"),
    feature = require("geoscript/feature");

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

    var schema = new feature.Schema({
        name: "building",
        fields: fields
    });
    
    assert.strictEqual(schema.fields.length, 3, "correct number of fields");
    for (var i=0; i<fields.length; ++i) {
        assert.deepEqual(schema.fields[i].type, fields[i].type, "correct field type for " + i);
        assert.deepEqual(schema.fields[i].name, fields[i].name, "correct field name for " + i);
    }
    
    assert.strictEqual(schema.geometry.name, "footprint", "correct geometry name");
    assert.strictEqual(schema.geometry.type, "Polygon", "correct geometry type");
    

};

exports["test: fields"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var fields = schema.fields;
    
    assert.ok(fields instanceof Array, "fields is array");
    assert.strictEqual(fields.length, 3, "correct fields length");
    assert.strictEqual(fields[0].name, "name", "correct name for first field");
    assert.strictEqual(fields[0].type, "String", "correct type for first field");
    assert.strictEqual(fields[1].name, "location", "correct name for second field");
    assert.strictEqual(fields[1].type, "Point", "correct type for second field");
    assert.ok(fields[1].projection instanceof proj.Projection, "geometry field has projection instance");
    assert.strictEqual(fields[1].projection.id, "EPSG:4326", "geometry field has correct projection id");
    assert.strictEqual(fields[2].name, "population", "correct name for third field");
    assert.strictEqual(fields[2].type, "Integer", "correct type for third field");
    
};

exports["test: fieldNames"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var names = schema.fieldNames;    
    assert.ok(names instanceof Array, "fieldNames is array");
    assert.deepEqual(["location", "name", "population"], names.sort(), "correct names");

};

exports["test: get"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var def = schema.get("name");
    assert.ok(!!def, "got field named 'name'");
    assert.strictEqual(def.name, "name", "correct name for 'name' field");
    assert.strictEqual(def.type, "String", "correct type for 'name' field");
    
    def = schema.get("location");
    assert.ok(!!def, "got field named 'location'");
    assert.strictEqual(def.name, "location", "correct name for 'location' field");
    assert.strictEqual(def.type, "Point", "correct type for 'location' field");
    assert.ok(def.projection instanceof proj.Projection, "'location' field has projection instance");
    
};

exports["test: geometry"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    assert.strictEqual(schema.geometry.name, "location", "correct geometry name");
    assert.strictEqual(schema.geometry.type, "Point", "correct geometry type");
    assert.ok(schema.geometry.projection instanceof proj.Projection, "correct geometry.projection type");
    assert.strictEqual(schema.geometry.projection.id, "EPSG:4326", "correct geometry.projection id");

};

exports["test: clone"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });
    
    var clone = schema.clone();
    
    assert.ok(clone instanceof feature.Schema, "clone is a Schema");
    assert.deepEqual(clone.fieldNames, schema.fieldNames, "clone has same field names");
    assert.strictEqual(clone.name, schema.name, "clone gets same name by default");
    
    var clone2 = schema.clone({name: "foo"});
    assert.strictEqual(clone2.name, "foo", "clone can be assigned a new name");
    
    var clone3 = schema.clone({
        fields: [
            {name: "location", type: "Polygon", projection: "epsg:4326"},
            {name: "newField", type: "String"}
        ]
    });
    
    assert.deepEqual(["name", "location", "population", "newField"], clone3.fieldNames, "clone extended with new field");
    assert.strictEqual(clone3.get("location").type, "Polygon", "clone given updated field config");

};

exports["test: _schema"] = function() {
    
    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            {name: "name", type: "String"},
            {name: "location", type: "Point", projection: "epsg:4326"}, 
            {name: "population", type: "Integer"}
        ]
    });    
    var _schema = schema._schema;
    
    assert.ok(_schema instanceof geotools.feature.simple.SimpleFeatureTypeImpl, "_schema of correct type");
    assert.strictEqual(_schema.getAttributeCount(), 3, "correct number of attributes");
    
    // test geometry
    var geomDesc = _schema.getGeometryDescriptor();
    assert.strictEqual(String(geomDesc.getLocalName()), "location", "correct geometry name");
    assert.ok(geomDesc.type.getBinding() === jts.geom.Point, "correct geometry type");
    var crs = geomDesc.getCoordinateReferenceSystem();
    assert.strictEqual(String(CRS.lookupIdentifier(crs, true)), "EPSG:4326", "correct geometry crs");
    
};

exports["test: fromValues"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    var schema = feature.Schema.fromValues(values);
    
    assert.ok(schema instanceof feature.Schema, "correct type");    

    // test field names
    assert.deepEqual(["location", "name", "population"], schema.fieldNames.sort(), "correct fieldNames");

    // test field types
    assert.deepEqual(schema.get("location").type, "Point", "correct location type");
    assert.deepEqual(schema.get("name").type, "String", "correct name type");
    assert.deepEqual(schema.get("population").type, "Double", "correct population type");

    // test geometry
    assert.strictEqual(schema.geometry.name, "location", "correct geometry name");
    assert.strictEqual(schema.geometry.type, "Point", "correct geometry type");
    
};

exports["test: from_"] = function() {

    var builder = new SimpleFeatureTypeBuilder();
    builder.setName(new NameImpl("test"));
    builder.add("name", java.lang.String);
    builder.add("population", java.lang.Integer);
    builder.crs(CRS.decode("epsg:4326"));
    builder.add("location", jts.geom.Point);
    var _schema = builder.buildFeatureType();
    var schema = feature.Schema.from_(_schema);

    assert.ok(schema instanceof feature.Schema, "schema of correct type");
    assert.strictEqual(schema.name, "test", "correct schema name");
    assert.strictEqual(schema.fields.length, 3, "correct number of fields");
    
    // test fields array
    assert.strictEqual(schema.fields[0].name, "name", "correct name for first field");
    assert.strictEqual(schema.fields[0].type, "String", "correct type for first field");
    assert.strictEqual(schema.fields[1].name, "population", "correct name for second field");
    assert.strictEqual(schema.fields[1].type, "Integer", "correct type for second field"); 
    assert.strictEqual(schema.fields[2].name, "location", "correct name for third field");
    assert.strictEqual(schema.fields[2].type, "Point", "correct type for third field");
    
    // test geometry
    assert.strictEqual(schema.geometry.name, "location", "correct name for geometry");
    assert.strictEqual(schema.geometry.type, "Point", "correct type for geometry");
    assert.ok(schema.geometry.projection instanceof proj.Projection, "correct type for geometry crs");
    assert.strictEqual(schema.geometry.projection.id, "EPSG:4326", "correct code for geometry crs");    
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
