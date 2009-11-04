var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj"),
    feature = require("geoscript/feature");

var geotools = Packages.org.geotools;
var CRS = geotools.referencing.CRS;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var NameImpl = geotools.feature.NameImpl;
var jts = Packages.com.vividsolutions.jts;

exports["test: Schema"] = function() {

    var schema = new feature.Schema({
        name: "building",
        fields: [
            ["address", "String"],
            ["floors", "Integer"],
            ["footprint", "Polygon"]
        ]
    });
    
    var fields = schema.fields;
    assert.isEqual(3, fields.length, "correct number of fields");
    
    assert.isEqual("footprint", schema.geom[0], "correct geometry name");
    
    var sorted = fields.slice().sort(function(a, b) {
        return a[0] == b[0] ? 0 : (a[0] < b[0] ? -1 : 1);
    });
    assert.isSame([
        ["address", "String"],
        ["floors", "Integer"],
        ["footprint", "Polygon"]
    ], sorted);

};

exports["test: Schema.geom"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            ["name", "String"],
            ["location", "Point", "epsg:4326"], 
            ["population", "Integer"]
        ]
    });
    
    assert.isEqual(3, schema.geom.length);
    assert.isEqual("location", schema.geom[0]);
    assert.isEqual("Point", schema.geom[1]);
    assert.isTrue(schema.geom[2] instanceof proj.Projection);
    assert.isEqual("EPSG:4326", schema.geom[2].id);

};

exports["test: Schema.feature"] = function() {

    var schema = new feature.Schema({
        name: "test",
        fields: [
            ["geom", "Geometry"]
        ]
    });
    
    var values = {
        geom: new geom.Point([1, 2])        
    };
    
    var f = schema.feature(values);
    
    assert.isTrue(f instanceof feature.Feature, "creates feature");
    assert.isTrue(f.schema === schema, "feature has correct schema");
    
    assert.isSame(values.geom.coordinates, f.get("geom").coordinates, "feature has correct geom");

};

exports["test: Schema._schema"] = function() {
    
    var schema = new feature.Schema({
        name: "Cities", 
        fields: [
            ["name", "String"],
            ["location", "Point", "epsg:4326"], 
            ["population", "Integer"]
        ]
    });    
    var _schema = schema._schema;
    
    assert.isTrue(_schema instanceof geotools.feature.simple.SimpleFeatureTypeImpl, "_schema of correct type");
    assert.isEqual(3, _schema.getAttributeCount(), "correct number of attributes");
    
    // test geom
    var geomDesc = _schema.getGeometryDescriptor();
    assert.isEqual("location", geomDesc.getLocalName(), "correct geometry name");
    assert.isTrue(geomDesc.type.getBinding() === jts.geom.Point, "correct geometry type");
    var crs = geomDesc.getCoordinateReferenceSystem();
    assert.isEqual("EPSG:4326", CRS.lookupIdentifier(crs, true), "correct geometry crs");
    
};

exports["test: Schema.fromValues"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    var schema = feature.Schema.fromValues(values);
    
    assert.isTrue(schema instanceof feature.Schema, "correct type");    

    // test attributes
    assert.isSame(["location", "name", "population"], schema.fieldNames.sort(), "correct fieldNames");
    var defs = schema.fields.slice().sort(function(a, b) {
        return a[0] == b[0] ? 0 : (a[0] < b[0] ? -1 : 1);
    });
    assert.isSame([
        ["location", "Point"],
        ["name", "String"],
        ["population", "Double"]
    ], defs, "correct fields");
    
    // test geom
    assert.isEqual(2, schema.geom.length, "correct geom length");
    assert.isEqual("location", schema.geom[0], "correct geom name");
    assert.isEqual("Point", schema.geom[1], "correct geom type");
    
};

exports["test: Schema.from_"] = function() {

    var builder = new SimpleFeatureTypeBuilder();
    builder.setName(new NameImpl("test"));
    builder.add("name", java.lang.String);
    builder.add("population", java.lang.Integer);
    builder.crs(CRS.decode("epsg:4326"));
    builder.add("location", jts.geom.Point);
    var _schema = builder.buildFeatureType();
    var schema = feature.Schema.from_(_schema);

    assert.isTrue(schema instanceof feature.Schema, "schema of correct type");
    assert.isEqual("test", schema.name, "correct schema name");
    assert.isEqual(3, schema.fields.length, "correct number of fields");
    
    // test fields array
    assert.isEqual("name", schema.fields[0][0], "correct name for first field");
    assert.isEqual("String", schema.fields[0][1], "correct type for first field");
    assert.isEqual("population", schema.fields[1][0], "correct name for second field");
    assert.isEqual("Integer", schema.fields[1][1], "correct type for second field"); 
    assert.isEqual("location", schema.fields[2][0], "correct name for third field");
    assert.isEqual("Point", schema.fields[2][1], "correct type for third field");
    
    // test geom
    assert.isEqual(3, schema.geom.length, "correct length for geom array");
    assert.isEqual("location", schema.geom[0], "correct name for geom");
    assert.isEqual("Point", schema.geom[1], "correct type for geom");
    assert.isTrue(schema.geom[2] instanceof proj.Projection, "correct type for geom crs");
    assert.isEqual("EPSG:4326", schema.geom[2].id, "correct code for geom crs");    
    
};

exports["test: Feature"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    assert.isTrue(f instanceof feature.Feature, "feature created");
    assert.isEqual(values.name, f.get("name"), "correct name value");
    // TODO: decide whether we need to maintain geometry identity when creating features
    assert.isSame(values.location.coordinates,f.get("location").coordinates, "correct location value");
    assert.isEqual(values.population, f.get("population"), "correct population value");    
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
