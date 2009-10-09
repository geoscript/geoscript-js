var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj"),
    feature = require("geoscript/feature");

exports["test: Schema"] = function() {

    var schema = new feature.Schema({
        name: "building",
        atts: [
            ["address", "String"],
            ["floors", "Integer"],
            ["footprint", "Polygon"]
        ]
    });
    
    var atts = schema.atts;
    assert.isEqual(3, atts.length);
    
    assert.isEqual("footprint", schema.geom[0]);
    
    atts.sort(function(a, b) {
        return a[0] == b[0] ? 0 : (a[0] < b[0] ? -1 : 1);
    });
    assert.isSame([
        ["address", "String"],
        ["floors", "Integer"],
        ["footprint", "Polygon"]
    ], atts);

};

exports["test: Schema.geom"] = function() {

    var schema = new feature.Schema({
        name: "Cities", 
        atts: [
            ["name", "String"],
            ["location", "Point", "epsg:4326"], 
            ["population", "Integer"]
        ]
    });
    
    assert.isEqual(3, schema.geom.length);
    assert.isEqual("location", schema.geom[0]);
    assert.isEqual("Point", schema.geom[1]);
    assert.isTrue(schema.geom[2] instanceof proj.Projection);
    assert.isEqual("EPSG:4326", schema.geom[2].code);

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}