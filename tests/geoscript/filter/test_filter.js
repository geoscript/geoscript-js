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

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
