var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var symbolizer = new STYLE.Style({});
    
    ASSERT.ok(symbolizer instanceof STYLE.Symbolizer, "is Symbolizer");
    ASSERT.ok(symbolizer instanceof STYLE.Style, "is Style");

};

exports["test: and"] = function() {
    
    var s1 = new STYLE.Symbolizer({});
    var s2 = new STYLE.Symbolizer({});
    var s3 = new STYLE.Symbolizer({});
    
    var composite = s1.and(s2);
    ASSERT.ok(composite instanceof STYLE.Style, "is Style");
    
    var o = composite.and(s3);
    
    ASSERT.ok(o === composite, "returns self");
    
    ASSERT.strictEqual(composite.parts.length, 3, "composite has three parts");
    ASSERT.ok(composite.parts[0] === s1, "first part");
    ASSERT.ok(composite.parts[1] === s2, "second part");
    ASSERT.ok(composite.parts[2] === s3, "third part");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
