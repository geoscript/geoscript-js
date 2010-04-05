
exports["test: json"] = require("./io/test_json");

if (require.main == module) {
    require("test/runner").run(exports);
}
