var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    feature = require("geoscript/feature");

exports["test: constructor"] = function() {
    
    var values = {
        name: "Some Location",
        location: new geom.Point([1, 2]),
        population: 100
    };
    
    var f = new feature.Feature({values: values});
    
    assert.isTrue(f instanceof feature.Feature, "feature created");
    assert.is(values.name, f.get("name"), "correct name value");
    assert.is(values.population, f.get("population"), "correct population value");    
    assert.is(values.location, f.get("location"), "correct location value using get");
    assert.is(values.location, f.geometry, "correct location value using geometry");
    
};

exports["test: bounds"] = function() {

    var schema = new feature.Schema({fields: [
        {name: "location", type: "Geometry"},
        {name: "name", type: "String"}
    ]});
    var f, g;
    
    // test no geometry
    f = new feature.Feature({schema: schema});
    assert.is(undefined, f.bounds, "undefined for no geometry");
    
    // test point
    g = new geom.Point([1, 2]);
    f.set("location", g);
    assert.isTrue(g.bounds.equals(f.bounds), "point bounds");

    // test linestring
    g = new geom.LineString([[0, 5], [10, 15]]);
    f.set("location", g);
    assert.isTrue(g.bounds.equals(f.bounds), "linestring bounds");    
    
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
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("Feature", obj.type, "correct type");
        var props = {
            name: values.name,
            population: values.population
        };
        assert.isSame(props, obj.properties, "correct properties");
        var g = obj.geometry;
        assert.is("Point", g.type, "correct geometry type");
        assert.isSame([1, 2], g.coordinates, "correct geometry coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
    

};

if (require.main == module) {
    require("test/runner").run(exports);
}
