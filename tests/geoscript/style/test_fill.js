var ASSERT = require("assert");
var Symbolizer = require("geoscript/style").Symbolizer;
var Fill = require("geoscript/style").Fill;

exports["test: constructor"] = function() {
    
    var fill = new Fill({});
    
    ASSERT.ok(fill instanceof Symbolizer, "is Symbolizer");
    ASSERT.ok(fill instanceof Fill, "is Fill");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
