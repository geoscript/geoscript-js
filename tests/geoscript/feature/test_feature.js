var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    feature = require("geoscript/feature");

exports["test: Feature.constructor"] = function() {
    
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

if (require.main === module.id) {
    require("test/runner").run(exports);
}
