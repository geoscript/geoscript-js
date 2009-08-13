exports.test_geom = require("./geoscript/geom");
exports.test_proj = require("./geoscript/proj");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
