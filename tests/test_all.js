exports["test: geoscript"] = require("./test_geoscript");

print(module.id);

if (require.main === module.id) {
    require("test/runner").run(exports);
}