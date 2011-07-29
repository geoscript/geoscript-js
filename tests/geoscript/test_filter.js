var ASSERT = require("assert");
var Feature = require("geoscript/feature").Feature;
var FILTER = require("geoscript/filter");

exports["test Filter.constructor"] = function() {
    
    var f = new FILTER.Filter();
    ASSERT.ok(f instanceof FILTER.Filter, "constructor returns instance");
    
};

exports["test Filter.cql"] = function() {
    
    var cql = "name = 'foo'";
    var f = new FILTER.Filter(cql);    
    ASSERT.strictEqual(f.cql, cql, "correct cql");
    
};

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

exports["test Filter.evaluate"] = function() {
    
    var chicken = new Feature({values: {
        type: "fowl",
        flies: 0,
        makes: "soup",
        price: 3
    }});
    
    var dog = new Feature({values: {
        type: "pet",
        flies: 0,
        makes: "noise",
        cost: 50
    }});
    
    var parakeet = new Feature({values: {
        type: "pet",
        flies: 1,
        makes: "noise",
        cost: 10
    }});

    var isPet = new FILTER.Filter("type = 'pet'");
    var isFowl = new FILTER.Filter("type = 'fowl'");
    var canFly = new FILTER.Filter("flies = 1");
    var makesSoup = new FILTER.Filter("makes = 'soup'");
    var isCheap = new FILTER.Filter("cost BETWEEN 0 and 15");
    var isFlyingPet = FILTER.and([isPet, canFly]);
    var isCheapPet = FILTER.and([isPet, isCheap]);
    var isBirdish = FILTER.or([isFowl, canFly]);
    
    ASSERT.ok(isPet.evaluate(dog), "dog isPet");
    ASSERT.isFalse(isPet.evaluate(chicken), "chicken isPet");
    ASSERT.ok(canFly.evaluate(parakeet), "parakeet canFly");
    ASSERT.isFalse(canFly.evaluate(dog), "dog canFly");
    ASSERT.ok(isFlyingPet.evaluate(parakeet), "parakeet isFlyingPet");
    ASSERT.isFalse(isFlyingPet.evaluate(dog), "dog isFlyingPet");
    ASSERT.ok(makesSoup.evaluate(chicken), "chicken makesSoup");
    ASSERT.isFalse(isCheapPet.evaluate(dog), "dog isCheapPet");
    ASSERT.ok(isCheapPet.evaluate(parakeet), "parakeet isCheapPet");
    ASSERT.isFalse(isBirdish.evaluate(dog), "dog isBirdish");
    ASSERT.ok(isBirdish.evaluate(chicken), "chicken isBirdish");
    
    // test chaining
    isFlyingPet = isPet.and(canFly);
    isCheapPet = isPet.and(isCheap);
    isBirdish = isFowl.or(canFly);
    ASSERT.ok(isFlyingPet.evaluate(parakeet), "(chained) parakeet isFlyingPet");
    ASSERT.isFalse(isFlyingPet.evaluate(dog), "(chained) dog isFlyingPet");
    ASSERT.isFalse(isCheapPet.evaluate(dog), "(chained) dog isCheapPet");
    ASSERT.ok(isCheapPet.evaluate(parakeet), "(chained) parakeet isCheapPet");
    ASSERT.isFalse(isBirdish.evaluate(dog), "(chained) dog isBirdish");
    ASSERT.ok(isBirdish.evaluate(chicken), "(chained) chicken isBirdish");

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

exports["test Filter.toXML"] = function() {

    // TODO: determine why this fails
    
    // var cql = "name = 'foo'";
    // var f = new FILTER.Filter(cql);
    // var xml = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:PropertyIsEqualTo><ogc:PropertyName>name</ogc:PropertyName><ogc:Literal>foo</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>';
    // ASSERT.strictEqual(f.toXML(), xml, "correct xml");
    
};

exports["test Filter.fromXML"] = function() {
    
    // TODO: determine why this fails
    
    // var xml = '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"><ogc:PropertyIsEqualTo><ogc:PropertyName>name</ogc:PropertyName><ogc:Literal>foo</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>';
    // var f = new FILTER.Filter.fromXML(xml);
    // var cql = "name = 'foo'";
    // ASSERT.strictEqual(f.cql, cql, "fromXML produces good filter");
    
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
