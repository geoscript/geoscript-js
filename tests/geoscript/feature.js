var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    feature = require("geoscript/feature");

exports.test_Schema = function() {

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
    
    atts.sort(function(a, b) {
        return a[0] == b[0] ? 0 : (a[0] < b[0] ? -1 : 1);
    });
    assert.isSame([
        ["address", "String"],
        ["floors", "Integer"],
        ["footprint", "Polygon"]
    ], atts);

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}