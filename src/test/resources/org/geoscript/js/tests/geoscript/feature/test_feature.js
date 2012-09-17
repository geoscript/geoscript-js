var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var FEATURE = require("geoscript/feature");
var Projection = require("geoscript/proj").Projection;

exports["test: constructor"] = function() {
    
    var properties = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100
    };
    
    var f = new FEATURE.Feature({properties: properties});
    
    ASSERT.ok(f instanceof FEATURE.Feature, "feature created");
    ASSERT.strictEqual(f.get("name"), properties.name, "correct name value");
    ASSERT.strictEqual(f.get("population"), properties.population, "correct population value");    
    ASSERT.strictEqual(f.get("location"), properties.location, "correct location value using get");
    ASSERT.strictEqual(f.geometry, properties.location, "correct location value using geometry");
    
    ASSERT.throws(function() {
        var f = new FEATURE.Feature({
            schema: [{name: "foo", type: "String"}],
            properties: {bar: "bad field"}
        });
    }, Error, "property name mistmatch with schema");
    
};

exports["test: get"] = function() {

    var now = new Date();

    var properties = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100,
        time: now,
        legit: true
    };
    
    var f = new FEATURE.Feature({properties: properties});
    
    ASSERT.strictEqual(typeof f.get("name"), "string", "correct name type");
    ASSERT.strictEqual(f.get("name"), "Some Location", "correct name value");
    ASSERT.strictEqual(f.get("population"), 100, "correct population value");
    ASSERT.ok(f.get("time") instanceof Date, "time is date");
    ASSERT.strictEqual(f.get("time").getTime(), now.getTime(), "correct time");

    ASSERT.strictEqual(f.get("legit"), true, "correct legit value");
    
    f.set("population", 0);
    ASSERT.strictEqual(f.get("population"), 0, "correct population value after setting to 0");    

    f.set("name", null);
    ASSERT.strictEqual(f.get("name"), null, "correct name value after setting to null");    
    
    ASSERT.strictEqual(typeof f.get("foo"), "undefined", "undefined field has undefined value");
    
};

exports["test: set"] = function() {
    
    var now = new Date();

    var properties = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100,
        time: now,
        legit: false
    };
    
    var f = new FEATURE.Feature({properties: properties});
    
    f.set("name", "New Name");
    ASSERT.strictEqual(f.get("name"), "New Name", "correct new name value");
    
    f.set("population", 150);
    ASSERT.strictEqual(f.get("population"), 150, "correct new population value");    
    
    var point = new GEOM.Point([2, 3]);
    f.set("location", point);
    ASSERT.ok(point.equals(f.get("location")), "correct new location value using get");
    ASSERT.ok(point.equals(f.geometry), "correct new location value using geometry");
    ASSERT.strictEqual(f.projection, null, "null projection");
    
    point = new GEOM.Point([3, 4]);
    f.geometry = point;
    ASSERT.ok(point.equals(f.geometry), "geometry correctly set");
    
    var later = new Date(now.getTime() + 100);
    f.set("time", later);
    ASSERT.ok(f.get("time") instanceof Date, "time set to a date");
    ASSERT.strictEqual(f.get("time").getTime(), later.getTime(), "time set correctly");
    
    f.set("legit", true);
    ASSERT.strictEqual(f.get("legit"), true, "set legit true");
    f.set("legit", false);
    ASSERT.strictEqual(f.get("legit"), false, "set legit false");
    
    ASSERT.throws(function() {
        f.set("bogusname", "some value");
    }, Error, "bogus field name");
    
};

exports["test: projection handling"] = function() {
    var feature;
    var point0 = new GEOM.Point([1, 2]);
    var point1 = point0.clone();
    point1.projection = "epsg:4326";
    
    // feature without a projection
    feature = new FEATURE.Feature({
        properties: {geom: point0}
    });
    ASSERT.strictEqual(feature.projection, null, "null feature projection");
    ASSERT.strictEqual(feature.geometry.projection, null, "null geometry projection");
    ASSERT.strictEqual(feature.schema.geometry.projection, null, "null schema geometry projection");
    
    ASSERT.throws(function() {
        f.geometry = point1;
    }, Error, "cant add geometry with projection to feature without");
    
    // feature with a projection
    feature = new FEATURE.Feature({
        properties: {geom: point1}
    });
    var projection = feature.projection;
    ASSERT.ok(projection instanceof Projection, "feature projection");
    ASSERT.strictEqual(projection.id, "EPSG:4326");
    ASSERT.ok(projection.equals(feature.geometry.projection), "correct geom projection");
    
    var schema = new FEATURE.Schema({
        name: "test-schema",
        fields: [{
            name: "geom", type: "Point", projection: "EPSG:3857"
        }]
    });
    
    feature = new FEATURE.Feature({
        schema: schema
    });
    
    projection = feature.projection;
    ASSERT.ok(projection instanceof Projection, "feature projection");
    ASSERT.strictEqual(projection.id, "EPSG:3857");
    
    feature.geometry = point0;
    projection = feature.geometry.projection;
    ASSERT.ok(projection instanceof Projection, "geometry projection");
    ASSERT.strictEqual(projection.id, "EPSG:3857");
    
    feature.geometry = point1;
    var geometry = feature.geometry;
    projection = geometry.projection;
    ASSERT.ok(projection instanceof Projection, "geometry projection");
    ASSERT.strictEqual(projection.id, "EPSG:3857");
    
    ASSERT.ok(geometry.equals(point1.transform("EPSG:3857")));
    
};

exports["test: bounds"] = function() {

    var schema = new FEATURE.Schema({fields: [
        {name: "location", type: "Geometry"},
        {name: "name", type: "String"}
    ]});
    var f, g;
    
    // test no geometry
    f = new FEATURE.Feature({schema: schema});
    ASSERT.strictEqual(f.bounds, null, "null for no geometry");
    
    // test point
    g = new GEOM.Point([1, 2]);
    f.set("location", g);
    ASSERT.ok(g.bounds.equals(f.bounds), "point bounds");

    // test linestring
    g = new GEOM.LineString([[0, 5], [10, 15]]);
    f.set("location", g);
    ASSERT.ok(g.bounds.equals(f.bounds), "linestring bounds");    
    
};

exports["test: json"] = function() {

    var properties = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100
    };
    
    var f = new FEATURE.Feature({properties: properties});
    
    var json = f.json;
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "Feature", "correct type");
        var props = {
            name: properties.name,
            population: properties.population
        };
        ASSERT.deepEqual(obj.properties, props, "correct properties");
        var g = obj.geometry;
        ASSERT.strictEqual(g.type, "Point", "correct geometry type");
        ASSERT.deepEqual([1, 2], g.coordinates, "correct geometry coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: clone"] = function() {
    
    var point = new GEOM.Point([1, 2]);
    point.projection = "EPSG:4326";
    
    var properties = {
        name: "Some Location",
        location: point,
        population: 100
    };
    
    var f = new FEATURE.Feature({properties: properties});
    var c = f.clone();
    
    ASSERT.ok(c instanceof FEATURE.Feature, "clone is feature");
    ASSERT.strictEqual(c.get("population"), 100, "population from original");
    
    c.set("population", 150);
    ASSERT.strictEqual(c.get("population"), 150, "set population on clone");
    ASSERT.strictEqual(f.get("population"), 100, "original is unmodified");
    
    var c2 = f.clone({
        properties: {population: 200}
    });
    ASSERT.strictEqual(c2.get("population"), 200, "clone extended with value from config");
    
    var c3 = f.clone({
        schema: {
            fields: [
                {name: "name", type: "String"},
                {name: "location", type: "Point"}
            ]
        }
    });
    ASSERT.strictEqual(c3.get("population"), undefined, "clone limited to provided schema");
    ASSERT.strictEqual(c3.get("name"), "Some Location", "clone given name from original");
    
};

exports["test: schema"] = function() {
    
    var f = new FEATURE.Feature({
        schema: {
            name: "mySchema",
            fields: [
                {name: "dateField", type: "Date"},
                {name: "timeField", type: "Time"},
                {name: "datetimeField", type: "Datetime"},
                {name: "timestampField", type: "Timestamp"},
                {name: "bigDecField", type: "BigDecimal"},
                {name: "uriField", type: "URI"}
            ]
        }
    });

    
    f.set("dateField", new Date());
    ASSERT.ok(f.get("dateField") instanceof Date, "java.sql.Date");
    f.set("timeField", new Date());
    ASSERT.ok(f.get("timeField") instanceof Date, "java.sql.Time");
    f.set("datetimeField", new Date());
    ASSERT.ok(f.get("datetimeField") instanceof Date, "java.util.Date");
    f.set("timestampField", new Date());
    ASSERT.ok(f.get("timestampField") instanceof Date, "java.sql.Timestamp");
    
    function assertNull(name) {
        f.set(name, null);
        ASSERT.strictEqual(f.get(name), null, name + " set to null");
    }
    
    assertNull("dateField");
    assertNull("timeField");
    assertNull("datetimeField");
    assertNull("timestampField");
    assertNull("bigDecField");
    assertNull("uriField");
    
}



if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
