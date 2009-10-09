exports.test_geom = require("./geoscript/geom");
exports.test_proj = require("./geoscript/proj");
exports.test_feature = require("./geoscript/feature");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
