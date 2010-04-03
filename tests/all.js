exports["test: geoscript"] = require("./test_geoscript");

if (require.main == module || require.main == module.id) {
    require("test/runner").run(exports);
}