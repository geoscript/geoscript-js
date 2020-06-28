exports["test: Format"] = require("./raster/test_format");
exports["test: Raster"] = require("./raster/test_raster");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
