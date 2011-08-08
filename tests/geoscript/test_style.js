exports["test: Composite"] = require("./style/test_composite");
exports["test: Symbolizer"] = require("./style/test_symbolizer");
exports["test: Color"] = require("./style/test_color");
exports["test: Shape"] = require("./style/test_shape");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
