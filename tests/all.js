exports["test: geoscript"] = require("./test_geoscript");

if (require.main == module) {
    require("test/runner").run(exports);
}