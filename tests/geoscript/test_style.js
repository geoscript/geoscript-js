exports["test: Composite"] = require("./style/test_composite");
exports["test: Symbolizer"] = require("./style/test_symbolizer");
exports["test: Color"] = require("./style/test_color");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
