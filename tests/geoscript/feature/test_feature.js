var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var FEATURE = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var values = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100
    };
    
    var f = new FEATURE.Feature({values: values});
    
    ASSERT.ok(f instanceof FEATURE.Feature, "feature created");
    ASSERT.strictEqual(f.get("name"), values.name, "correct name value");
    ASSERT.strictEqual(f.get("population"), values.population, "correct population value");    
    ASSERT.strictEqual(f.get("location"), values.location, "correct location value using get");
    ASSERT.strictEqual(f.geometry, values.location, "correct location value using geometry");
    
    ASSERT.throws(function() {
        var f = new FEATURE.Feature({
            schema: [{name: "foo", type: "String"}],
            values: {bar: "bad field"}
        });
    }, Error, "values mistmatch with schema");
    
};

exports["test: get"] = function() {

    var now = new Date();

    var values = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100,
        time: now,
        legit: true
    };
    
    var f = new FEATURE.Feature({values: values});
    
    ASSERT.strictEqual(typeof f.get("name"), "string", "correct name type");
    ASSERT.strictEqual(f.get("name"), "Some Location", "correct name value");
    ASSERT.strictEqual(f.get("population"), 100, "correct population value");
    ASSERT.ok(f.get("time") instanceof Date, "time is date");
    ASSERT.strictEqual(f.get("time").getTime(), now.getTime(), "correct time");
    var _value = f._feature.getAttribute("time");
    ASSERT.ok(_value instanceof java.util.Date, "underlying time attribute is java.util.Date");
    
    ASSERT.strictEqual(f.get("legit"), true, "correct legit value");
    
    f.set("population", 0);
    ASSERT.strictEqual(f.get("population"), 0, "correct population value after setting to 0");    

    f.set("name", null);
    ASSERT.strictEqual(f.get("name"), null, "correct name value after setting to null");    
    
    ASSERT.strictEqual(typeof f.get("foo"), "undefined", "undefined field has undefined value");
    
};

exports["test: set"] = function() {
    
    var now = new Date();

    var values = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100,
        time: now,
        legit: false
    };
    
    var f = new FEATURE.Feature({values: values});
    
    f.set("name", "New Name");
    ASSERT.strictEqual(f.get("name"), "New Name", "correct new name value");
    
    f.set("population", 150);
    ASSERT.strictEqual(f.get("population"), 150, "correct new population value");    
    
    var point = new GEOM.Point([2, 3]);
    f.set("location", point);
    ASSERT.ok(point.equals(f.get("location")), "correct new location value using get");
    ASSERT.ok(point.equals(f.geometry), "correct new location value using geometry");
    
    point = new GEOM.Point([3, 4]);
    point.projection = "EPSG:4326";
    f.geometry = point;
    ASSERT.ok(point.equals(f.geometry), "geometry correctly set");
    
    var later = new Date(now.getTime() + 100);
    f.set("time", later);
    ASSERT.ok(f.get("time") instanceof Date, "time set to a date");
    ASSERT.strictEqual(f.get("time").getTime(), later.getTime(), "time set correctly");
    
    var _value = f._feature.getAttribute("time");
    ASSERT.ok(_value instanceof java.util.Date, "underlying time attribute is java.util.Date");
    
    f.set("legit", true);
    ASSERT.strictEqual(f.get("legit"), true, "set legit true");
    f.set("legit", false);
    ASSERT.strictEqual(f.get("legit"), false, "set legit false");
    
    ASSERT.throws(function() {
        f.set("bogusname", "some value");
    }, Error, "bogus field name");
    
};

exports["test: bounds"] = function() {

    var schema = new FEATURE.Schema({fields: [
        {name: "location", type: "Geometry"},
        {name: "name", type: "String"}
    ]});
    var f, g;
    
    // test no geometry
    f = new FEATURE.Feature({schema: schema});
    ASSERT.strictEqual(f.bounds, undefined, "undefined for no geometry");
    
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

    var values = {
        name: "Some Location",
        location: new GEOM.Point([1, 2]),
        population: 100
    };
    
    var f = new FEATURE.Feature({values: values});
    
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
            name: values.name,
            population: values.population
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
    
    var values = {
        name: "Some Location",
        location: point,
        population: 100
    };
    
    var f = new FEATURE.Feature({values: values});
    var c = f.clone();
    
    ASSERT.ok(c instanceof FEATURE.Feature, "clone is feature");
    ASSERT.strictEqual(c.get("population"), 100, "population from original");
    
    c.set("population", 150);
    ASSERT.strictEqual(c.get("population"), 150, "set population on clone");
    ASSERT.strictEqual(f.get("population"), 100, "original is unmodified");
    
    var c2 = f.clone({
        values: {population: 200}
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
    
    function assertCorrectBinding(name, type) {
        var field = f.schema.get(name);
        ASSERT.strictEqual(field._field.getType().getBinding(), type, "binding for " + name);
    }
    
    assertCorrectBinding("dateField", java.sql.Date);
    assertCorrectBinding("timeField", java.sql.Time);
    assertCorrectBinding("datetimeField", java.util.Date);
    assertCorrectBinding("timestampField", java.sql.Timestamp);
    assertCorrectBinding("bigDecField", java.math.BigDecimal);
    assertCorrectBinding("uriField", java.net.URI);
    
    f.set("dateField", new Date());
    ASSERT.ok(f._feature.getAttribute("dateField") instanceof java.sql.Date, "date cast to java.sql.Date");
    f.set("timeField", new Date());
    ASSERT.ok(f._feature.getAttribute("timeField") instanceof java.sql.Time, "date cast to java.sql.Time");
    f.set("datetimeField", new Date());
    ASSERT.ok(f._feature.getAttribute("datetimeField") instanceof java.util.Date, "date cast to java.util.Date");
    f.set("timestampField", new Date());
    ASSERT.ok(f._feature.getAttribute("timestampField") instanceof java.sql.Timestamp, "date cast to java.sql.Timestamp");
    
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
