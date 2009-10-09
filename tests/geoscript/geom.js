var assert = require("test/assert"),
    geom = require("geoscript/geom");

exports["test: point"] = require("./geom/point");
exports["test: linestring"] = require("./geom/linestring");
exports["test: polygon"] = require("./geom/polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
