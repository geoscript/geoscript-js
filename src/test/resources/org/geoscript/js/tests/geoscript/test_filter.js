var ASSERT = require("assert");
var Feature = require("geoscript/feature").Feature;
var FILTER = require("geoscript/filter");

exports["test and"] = function() {
    
    var f = FILTER.and(["name = 'foo'", "type = 'bar'"]);
    ASSERT.strictEqual(f.cql, "(name = 'foo' AND type = 'bar')", "correct cql");
    
};

exports["test or"] = function() {
    
    var f = FILTER.or(["name = 'foo'", "type = 'bar'"]);
    ASSERT.strictEqual(f.cql, "(name = 'foo' OR type = 'bar')", "correct cql");
    
};

exports["test not"] = function() {
    
    var f = FILTER.not("name = 'foo'");
    ASSERT.strictEqual(f.cql, "NOT (name = 'foo')", "correct cql");
    
};


exports["test where"] = function() {
    
    var f = FILTER.where("name = 'foo'");
    ASSERT.ok(f instanceof FILTER.Filter);
    
    var bar = new Feature({values: {name: "foo"}});
    ASSERT.isTrue(f.evaluate(bar), "bar passed");
    
    f = FILTER.where("WITHIN", "the_geom", "POINT(1 1)");
    ASSERT.strictEqual(f.cql, "WITHIN(the_geom, POINT (1 1))", "correct cql");

    f = FILTER.where(["WITHIN", "the_geom", "POINT(1 1)"]);
    ASSERT.strictEqual(f.cql, "WITHIN(the_geom, POINT (1 1))", "correct cql");

}

exports["test create"] = function() {
    
    var f = FILTER.create("name = 'foo'");
    ASSERT.ok(f instanceof FILTER.Filter);
    
    var bar = new Feature({values: {name: "foo"}});
    ASSERT.isTrue(f.evaluate(bar), "bar passed");
    
    var baz = new Feature({values: {name: "baz"}});
    ASSERT.isFalse(f.evaluate(baz), "baz didn't pass");
    
    ASSERT.throws(function() {
        FILTER.create("bogus");
    }, Error, "create throws with bogus CQL");
    
}

exports["test Filter"] = require("./filter/test_filter");
exports["test Expression"] = require("./filter/test_expression");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
