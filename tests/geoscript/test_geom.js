var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports["test: point"] = require("./geom/test_point");
exports["test: linestring"] = require("./geom/test_linestring");
exports["test: polygon"] = require("./geom/test_polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
