exports["test: geom"] = require("./geoscript/test_geom");
exports["test: proj"] = require("./geoscript/test_proj");
exports["test: feature"] = require("./geoscript/test_feature");
exports["test: filter"] = require("./geoscript/test_filter");
exports["test: layer"] = require("./geoscript/test_layer");
exports["test: workspace"] = require("./geoscript/test_workspace");
exports["test: util"] = require("./geoscript/test_util");

if (require.main == module.id) {
    require("test").run(exports);
}
