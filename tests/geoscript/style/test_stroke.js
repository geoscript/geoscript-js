var ASSERT = require("assert");
var Symbolizer = require("geoscript/style").Symbolizer;
var Stroke = require("geoscript/style").Stroke;

exports["test: constructor"] = function() {
    
    var stroke = new Stroke({});
    
    ASSERT.ok(stroke instanceof Symbolizer, "is Symbolizer");
    ASSERT.ok(stroke instanceof Stroke, "is Stroke");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
