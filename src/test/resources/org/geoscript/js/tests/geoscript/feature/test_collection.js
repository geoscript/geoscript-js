var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var {Feature, Schema, Collection} = require("geoscript/feature");

var size = 10;
var schema = new Schema({
    name: "collection-test",
    fields: [
        {name: "place", type: "String"},
        {name: "geom", type: "Point"}
    ]
});

function createCollection() {

    var collection = new Collection({
        features: function() {
            for (var i=0; i<size; ++i) {
                yield new Feature({
                    schema: schema,
                    properties: {
                        place: "place_" + i,
                        geom: new GEOM.Point([
                                -180 + (i * 360 / (size - 1)),
                                -90 + (i * 180 / (size - 1))])
                    }
                });
            }
        }
    });
    
    return collection;
}

exports["test: constructor"] = function() {
    
    var collection = createCollection();
    ASSERT.ok(collection instanceof Collection, "instance");
    
};

exports["test: schema"] = function() {
    
    var collection = createCollection();
    var schema = collection.schema;
    ASSERT.ok(schema instanceof Schema, "schema instance");
    
    ASSERT.strictEqual(schema.fields.length, 2, "2 fields");
    
    ASSERT.strictEqual(schema.geometry.name, "geom", "geometry name");
    ASSERT.strictEqual(schema.geometry.type, "Point", "geometry type");
    
}

exports["test: iterator"] = function() {
    
    var count = 0;
    var collection = createCollection();
    for (var feature in collection) {
        ++count;
        ASSERT.ok(feature instanceof Feature, "feature " + count);
        ASSERT.strictEqual(feature.get("place"), "place_" + (count-1), "place " + count);
    }
    ASSERT.strictEqual(count, size, "iterated through all");
}

exports["test: size"] = function() {
    
    var collection = createCollection();
    ASSERT.strictEqual(collection.size, size, "size");
    
};

exports["test: size (after next)"] = function() {
    
    var collection = createCollection();
    
    var first = collection.next();
    ASSERT.ok(first instanceof Feature, "first feature");
    ASSERT.strictEqual(first.get("place"), "place_0", "first place");
    
    ASSERT.strictEqual(collection.size, size, "size");

    var second = collection.next();
    ASSERT.ok(second instanceof Feature, "second feature");
    ASSERT.strictEqual(second.get("place"), "place_1", "second place");

}

exports["test: size (custom)"] = function() {
    
    var collection = new Collection({
        size: function() {
            // though we have only one feature to yield, we'll pretend we have
            // more for the test
            return 5;
        },
        features: function() {
            yield new Feature({
                schema: schema,
                properties: {
                    place: "foo",
                    geom: new GEOM.Point([1, 2])
                }
            });
        }
    });
    
    ASSERT.strictEqual(collection.size, 5, "size");
    
};


exports["test: bounds"] = function() {

    var collection = createCollection();
    var bounds = collection.bounds;
    ASSERT.ok(bounds instanceof GEOM.Bounds, "bounds instance");
    ASSERT.ok(bounds.equals(new GEOM.Bounds([-180, -90, 180, 90])));

};

exports["test: bounds (custom)"] = function() {
    
    var collection = new Collection({
        bounds: function() {
            // instead of iterating to determine bounds, provide it here
            return new GEOM.Bounds([-10, -20, 30, 40]);
        },
        features: function() {
            yield new Feature({
                schema: schema,
                properties: {
                    place: "foo",
                    geom: new GEOM.Point([1, 2])
                }
            });
        }
    });
    
    ASSERT.ok(collection.bounds.equals(new GEOM.Bounds([-10, -20, 30, 40])), "bounds");
    
};

exports["test: close"] = function() {
    
    var collection = createCollection();
    
    var first = collection.next();
    ASSERT.ok(first instanceof Feature, "first feature");
    ASSERT.strictEqual(first.get("place"), "place_0", "first place");
    
    ASSERT.strictEqual(collection.size, size, "size before close");

    var second = collection.next();
    ASSERT.ok(second instanceof Feature, "second feature");
    ASSERT.strictEqual(second.get("place"), "place_1", "second place");
    
    collection.close();
    ASSERT.throws(function() {
        collection.next();
    }, StopIteration, "StopIteration thrown on next after close");
    
    ASSERT.strictEqual(collection.size, size, "size after close");

}

exports["test: close (custom)"] = function() {
    
    var calls = 0;
    
    var collection = new Collection({
        close: function() {
            // provide a custom close method
            // this will be called each time the generator is exhausted
            ++calls;
        },
        features: function() {
            for (var i=0; i<2; ++i) {
                yield new Feature({
                    schema: schema,
                    properties: {
                        place: "place_" + i,
                        geom: new GEOM.Point([1, 2])
                    }
                });
            }
        }
    });
    
    var first = collection.next();
    ASSERT.strictEqual(calls, 0, "close not called with first next");
    
    calls = 0;
    ASSERT.strictEqual(collection.size, 2, "size check");
    ASSERT.strictEqual(calls, 1, "close called with size check");
    
    calls = 0;
    var second = collection.next();
    ASSERT.strictEqual(calls, 0, "close not called with second next");
    
    calls = 0;
    ASSERT.throws(function() {
        collection.next();
    }, StopIteration, "Throws StopIteration after exhausted.");
    
    ASSERT.strictEqual(calls, 1, "close called after exhaustion");
    
    calls = 0;
    collection.close();
    ASSERT.strictEqual(calls, 1, "close called once");
    
}


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
