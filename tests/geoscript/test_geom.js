exports["test: Point"] = require("./geom/test_point");
exports["test: Linestring"] = require("./geom/test_linestring");
exports["test: Polygon"] = require("./geom/test_polygon");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
