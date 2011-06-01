exports["test: geoscript"] = require("./test_geoscript");

if (require.main == module || require.main == module.id) {
    system.exit(require("test").run(exports));
}