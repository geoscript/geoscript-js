var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports.test_point = require("./geom/point");
exports.test_linestring = require("./geom/linestring");
exports.test_polygon = require("./geom/polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
