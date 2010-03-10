var assert = require("test/assert"),
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
    
    assert.is(3, schema.fields.length, "correct number of fields");
    assert.isSame(fields, schema.fields, "correct fields");
    
    assert.is("footprint", schema.geometry.name, "correct geometry name");
    assert.is("Polygon", schema.geometry.type, "correct geometry type");
    

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
    
    assert.isTrue(fields instanceof Array, "fields is array");
    assert.is(3, fields.length, "correct fields length");
    assert.is("name", fields[0].name, "correct name for first field");
    assert.is("String", fields[0].type, "correct type for first field");
    assert.is("location", fields[1].name, "correct name for second field");
    assert.is("Point", fields[1].type, "correct type for second field");
    assert.isTrue(fields[1].projection instanceof proj.Projection, "geometry field has projection instance");
    assert.is("EPSG:4326", fields[1].projection.id, "geometry field has correct projection id");
    assert.is("population", fields[2].name, "correct name for third field");
    assert.is("Integer", fields[2].type, "correct type for third field");
    
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
    assert.isTrue(names instanceof Array, "fieldNames is array");
    assert.isSame(["location", "name", "population"], names.sort(), "correct names");

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
    assert.isTrue(!!def, "got field named 'name'");
    assert.is("name", def.name, "correct name for 'name' field");
    assert.is("String", def.type, "correct type for 'name' field");
    
    def = schema.get("location");
    assert.isTrue(!!def, "got field named 'location'");
    assert.is("location", def.name, "correct name for 'location' field");
    assert.is("Point", def.type, "correct type for 'location' field");
    assert.isTrue(def.projection instanceof proj.Projection, "'location' field has projection instance");
    
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
    
    assert.is("location", schema.geometry.name, "correct geometry name");
    assert.is("Point", schema.geometry.type, "correct geometry type");
    assert.isTrue(schema.geometry.projection instanceof proj.Projection, "correct geometry.projection type");
    assert.is("EPSG:4326", schema.geometry.projection.id, "correct geometry.projection id");

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
    
    assert.isTrue(clone instanceof feature.Schema, "clone is a Schema");
    assert.isSame(schema.fieldNames, clone.fieldNames, "clone has same field names");
    assert.is(schema.name, clone.name, "clone gets same name by default");
    
    var clone2 = schema.clone("foo");
    assert.is("foo", clone2.name, "clone can be assigned a new name");

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
    
    assert.isTrue(_schema instanceof geotools.feature.simple.SimpleFeatureTypeImpl, "_schema of correct type");
    assert.is(3, _schema.getAttributeCount(), "correct number of attributes");
    
    // test geometry
    var geomDesc = _schema.getGeometryDescriptor();
    assert.is("location", String(geomDesc.getLocalName()), "correct geometry name");
    assert.isTrue(geomDesc.type.getBinding() === jts.geom.Point, "correct geometry type");
    var crs = geomDesc.getCoordinateReferenceSystem();
    assert.is("EPSG:4326", String(CRS.lookupIdentifier(crs, true)), "correct geometry crs");
    
};

exports["test: fromValues"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    var schema = feature.Schema.fromValues(values);
    
    assert.isTrue(schema instanceof feature.Schema, "correct type");    

    // test attributes
    assert.isSame(["location", "name", "population"], schema.fieldNames.sort(), "correct fieldNames");
    var sorted = schema.fields.slice().sort(function(a, b) {
        return a.name == b.name ? 0 : (a.name < b.name ? -1 : 1);
    });
    assert.isSame([
        {name: "location", type: "Point"},
        {name: "name", type: "String"},
        {name: "population", type: "Double"}
    ], sorted, "correct fields");
    
    // test geometry
    assert.is("location", schema.geometry.name, "correct geometry name");
    assert.is("Point", schema.geometry.type, "correct geometry type");
    
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

    assert.isTrue(schema instanceof feature.Schema, "schema of correct type");
    assert.is("test", schema.name, "correct schema name");
    assert.is(3, schema.fields.length, "correct number of fields");
    
    // test fields array
    assert.is("name", schema.fields[0].name, "correct name for first field");
    assert.is("String", schema.fields[0].type, "correct type for first field");
    assert.is("population", schema.fields[1].name, "correct name for second field");
    assert.is("Integer", schema.fields[1].type, "correct type for second field"); 
    assert.is("location", schema.fields[2].name, "correct name for third field");
    assert.is("Point", schema.fields[2].type, "correct type for third field");
    
    // test geometry
    assert.is("location", schema.geometry.name, "correct name for geometry");
    assert.is("Point", schema.geometry.type, "correct type for geometry");
    assert.isTrue(schema.geometry.projection instanceof proj.Projection, "correct type for geometry crs");
    assert.is("EPSG:4326", schema.geometry.projection.id, "correct code for geometry crs");    
    
};

if (require.main == module) {
    require("test/runner").run(exports);
}
