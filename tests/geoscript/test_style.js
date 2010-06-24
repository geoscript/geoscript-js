
exports["test: PointSymbolizer"] = require("./style/test_point");

exports["test: LineSymbolizer"] = require("./style/test_line");

exports["test: PolygonSymbolizer"] = require("./style/test_polygon");

exports["test: Rule"] = require("./style/test_rule");

exports["test: Style"] = require("./style/test_style");

if (require.main == module.id) {
    require("test").run(exports);
}
