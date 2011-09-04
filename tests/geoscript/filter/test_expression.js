var ASSERT = require("assert");
var FILTER = require("geoscript/filter");

exports["test constructor"] = function() {
    
    var e = new FILTER.Expression();
    ASSERT.ok(e instanceof FILTER.Expression, "constructor returns instance");
    
};

exports["test literal"] = function() {
    
    var cases = [{
        config: "'foo'", literal: true,
        config: 2, literal: true,
        config: "foo", literal: false,
        config: {text: "foo"}, literal: false,
        config: {text: "'foo'"}, literal: true,
        config: {text: 2.234}, literal: true
    }];
    
    var e, c;
    for (var i=0, ii=cases.length; i<ii; ++i) {
        c = cases[i];
        e = new FILTER.Expression(c.config);
        ASSERT.strictEqual(e.literal, c.literal, "config: " + JSON.stringify(c.config));
    }
    
};
