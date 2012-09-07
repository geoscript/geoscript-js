var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var {Feature, Schema, FeatureCollection} = require("geoscript/feature");

var size = 10;
var schema = new Schema({
    name: "collection-test",
    fields: [
        {name: "place", type: "String"},
        {name: "geom", type: "Point"}
    ]
});

function createCollection() {

    var collection = new FeatureCollection({
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
    ASSERT.ok(collection instanceof FeatureCollection, "instance");
    
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
    
    count = 0;
    for (feature in collection) {
        ++count;
    }
    ASSERT.strictEqual(count, size, "iterated through all a second time");

}

exports["test: size"] = function() {
    
    var collection = createCollection();
    ASSERT.strictEqual(collection.size, size, "size");
    
};

exports["test: size (during iteration)"] = function() {
    
    var collection = createCollection();

    var i = 0;
    for (var feature in collection) {
        ASSERT.strictEqual(collection.size, size, i + ": size");
        ++i;
    }
    ASSERT.strictEqual(i, size, "iterated through all");

}

exports["test: size (custom)"] = function() {
    
    var collection = new FeatureCollection({
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
    
    var collection = new FeatureCollection({
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

exports["test: close (custom)"] = function() {
    
    var calls = 0;
    
    var collection = new FeatureCollection({
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
    
    calls = 0;
    ASSERT.strictEqual(collection.size, 2, "size check");
    ASSERT.strictEqual(calls, 1, "close called with size check");
    
    calls = 0;
    var i = 0;
    for (var feature in collection) {
        ASSERT.strictEqual(calls, 0, i + ": iteration");
        ++i;
    }
    ASSERT.strictEqual(calls, 1, "close called after iteration");
    
    calls = 0;
    collection.forEach(function(feature, i) {
        ASSERT.strictEqual(calls, 0, i + ": forEach");
    });
    ASSERT.strictEqual(calls, 1, "close called after forEach");
    
    // break out of forEach early
    calls = 0;
    var count = 0;
    collection.forEach(function(feature, i) {
        ++count;
        return false;
    });
    ASSERT.strictEqual(count, 1, "forEach cancelled early");
    ASSERT.strictEqual(calls, 1, "close called after forEach cancelled");
    
}


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
