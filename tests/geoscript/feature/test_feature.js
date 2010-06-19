var assert = require("assert"),
    geom = require("geoscript/geom"),
    feature = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    assert.ok(f instanceof feature.Feature, "feature created");
    assert.strictEqual(f.get("name"), values.name, "correct name value");
    assert.strictEqual(f.get("population"), values.population, "correct population value");    
    assert.strictEqual(f.get("location"), values.location, "correct location value using get");
    assert.strictEqual(f.geometry, values.location, "correct location value using geometry");
    
};

exports["test: get"] = function() {

    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    assert.strictEqual(typeof f.get("name"), "string", "correct name type");
    assert.strictEqual(f.get("name"), "Some Location", "correct name value");
    
    assert.strictEqual(typeof f.get("foo"), "undefined", "undefined field has undefined value");
    
};

exports["test: set"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    f.set("name", "New Name");
    assert.strictEqual(f.get("name"), "New Name", "correct new name value");
    
    f.set("population", 150);
    assert.strictEqual(f.get("population"), 150, "correct new population value");    
    
    var point = new geom.Point([2, 3]);
    f.set("location", point);
    assert.ok(point.equals(f.get("location")), "correct new location value using get");
    assert.ok(point.equals(f.geometry), "correct new location value using geometry");
    
    point = new geom.Point([3, 4]);
    point.projection = "EPSG:4326";
    f.geometry = point;
    assert.ok(point.equals(f.geometry), "geometry correctly set");    
    
};

exports["test: bounds"] = function() {

    var schema = new feature.Schema({fields: [
        {name: "location", type: "Geometry"},
        {name: "name", type: "String"}
    ]});
    var f, g;
    
    // test no geometry
    f = new feature.Feature({schema: schema});
    assert.strictEqual(f.bounds, undefined, "undefined for no geometry");
    
    // test point
    g = new geom.Point([1, 2]);
    f.set("location", g);
    assert.ok(g.bounds.equals(f.bounds), "point bounds");

    // test linestring
    g = new geom.LineString([[0, 5], [10, 15]]);
    f.set("location", g);
    assert.ok(g.bounds.equals(f.bounds), "linestring bounds");    
    
};

exports["test: json"] = function() {

    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    var json = f.json;
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.strictEqual(obj.type, "Feature", "correct type");
        var props = {
            name: values.name,
            population: values.population
        };
        assert.deepEqual(obj.properties, props, "correct properties");
        var g = obj.geometry;
        assert.strictEqual(g.type, "Point", "correct geometry type");
        assert.deepEqual([1, 2], g.coordinates, "correct geometry coordinates");
    } else {
        assert.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: clone"] = function() {
    
    var point = new geom.Point([1, 2]);
    point.projection = "EPSG:4326";
    
    var values = {
        name: "Some Location",
        location: point,
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    var c = f.clone();
    
    assert.ok(c instanceof feature.Feature, "clone is feature");
    assert.strictEqual(c.get("population"), 100, "population from original");
    
    c.set("population", 150);
    assert.strictEqual(c.get("population"), 150, "set population on clone");
    assert.strictEqual(f.get("population"), 100, "original is unmodified");
    
    var c2 = f.clone({
        values: {population: 200}
    });
    assert.strictEqual(c2.get("population"), 200, "clone extended with value from config");
    
    var c3 = f.clone({
        schema: {
            fields: [
                {name: "name", type: "String"},
                {name: "location", type: "Point"}
            ]
        }
    });
    assert.strictEqual(c3.get("population"), undefined, "clone limited to provided schema");
    assert.strictEqual(c3.get("name"), "Some Location", "clone given name from original");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
