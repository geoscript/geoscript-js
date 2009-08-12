exports.test_geom = require("./geom-tests");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
