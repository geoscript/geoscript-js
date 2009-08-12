exports.test_geoscript = require("./geoscript");

print(module.id);

if (require.main === module.id) {
    require("test/runner").run(exports);
}