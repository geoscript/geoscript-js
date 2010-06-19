
exports["test: json"] = require("./io/test_json");

exports["test: wkt"] = require("./io/test_wkt");

if (require.main == module.id) {
    require("test").run(exports);
}
