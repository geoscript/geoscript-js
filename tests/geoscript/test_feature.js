exports["test: Feature"] = require("./feature/test_feature");
exports["test: Schema"] = require("./feature/test_schema");

if (require.main == module) {
    require("test/runner").run(exports);
}
