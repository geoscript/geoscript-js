exports["test: geom"] = require("./geoscript/test_geom");
exports["test: proj"] = require("./geoscript/test_proj");
exports["test: feature"] = require("./geoscript/test_feature");
exports["test: util"] = require("./geoscript/util");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
