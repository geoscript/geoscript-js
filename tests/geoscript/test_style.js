exports["test: Style"] = require("./style/test_style");
exports["test: Symbolizer"] = require("./style/test_symbolizer");
exports["test: Fill"] = require("./style/test_fill");
exports["test: Stroke"] = require("./style/test_stroke");
exports["test: Color"] = require("./style/test_color");
exports["test: Shape"] = require("./style/test_shape");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
