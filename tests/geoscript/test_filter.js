var assert = require("test/assert");
var Feature = require("geoscript/feature").Feature;
var filter = require("geoscript/filter");

exports["test Filter.constructor"] = function() {
    
    var f = new filter.Filter();
    assert.isTrue(f instanceof filter.Filter, "constructor returns instance");
    
};

exports["test Filter.cql"] = function() {
    
    var cql = "name = 'foo'";
    var f = new filter.Filter(cql);    
    assert.is(cql, f.cql, "correct cql");
    
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

    var isPet = new filter.Filter("type = 'pet'");
    var isFowl = new filter.Filter("type = 'fowl'");
    var canFly = new filter.Filter("flies = 1");
    var makesSoup = new filter.Filter("makes = 'soup'");
    var isCheap = new filter.Filter("cost BETWEEN 0 and 15");
    var isFlyingPet = filter.and([isPet, canFly]);
    var isCheapPet = filter.and([isPet, isCheap]);
    var isBirdish = filter.or([isFowl, canFly]);
    
    assert.isTrue(isPet.evaluate(dog), "dog isPet");
    assert.isFalse(isPet.evaluate(chicken), "chicken isPet");
    assert.isTrue(canFly.evaluate(parakeet), "parakeet canFly");
    assert.isFalse(canFly.evaluate(dog), "dog canFly");
    assert.isTrue(isFlyingPet.evaluate(parakeet), "parakeet isFlyingPet");
    assert.isFalse(isFlyingPet.evaluate(dog), "dog isFlyingPet");
    assert.isTrue(makesSoup.evaluate(chicken), "chicken makesSoup");
    assert.isFalse(isCheapPet.evaluate(dog), "dog isCheapPet");
    assert.isTrue(isCheapPet.evaluate(parakeet), "parakeet isCheapPet");
    assert.isFalse(isBirdish.evaluate(dog), "dog isBirdish");
    assert.isTrue(isBirdish.evaluate(chicken), "chicken isBirdish");

};


if (require.main === module.id) {
    require("test/runner").run(exports);
}
