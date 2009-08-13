var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj");

exports.test_transform = function() {

    var p = new geom.Point([-125, 50]);
    var rp = proj.transform(p, "epsg:4326", "epsg:3005");
    assert.isEqual(1071693, Math.floor(rp.x));
    assert.isEqual(554289, Math.floor(rp.y));

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}