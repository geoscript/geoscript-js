exports.test_geom = require("./geoscript/geom");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
