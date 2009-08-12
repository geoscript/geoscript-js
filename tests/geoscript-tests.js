exports.testGeoscript = require("./geoscript/all-tests");

print(module.id);

if (require.main === module.id) {
    require("test/runner").run(exports);
}