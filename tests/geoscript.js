exports["test: geom"] = require("./geoscript/geom");
exports["test: proj"] = require("./geoscript/proj");
exports["test: feature"] = require("./geoscript/feature");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
