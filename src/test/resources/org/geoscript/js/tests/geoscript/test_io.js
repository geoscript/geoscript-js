exports["test: JSON"] = require("./io/test_json");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
