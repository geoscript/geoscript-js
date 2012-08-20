var ASSERT = require("assert");
var Feature = require("geoscript/feature").Feature;
var Filter = require("geoscript/filter").Filter;
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: features"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var count, features, feature;
    
        // get all features
        features = layer.features;
        count = layer.count;

        var log = [];
        var testScope = {};
        features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

        ASSERT.strictEqual(log.length, count, "forEach calls block once for each feature");
        ASSERT.ok(log[0].args[0] instanceof Feature, "forEach calls block with feature");
        ASSERT.strictEqual(log[0].scope, testScope, "forEach calls block with correct scope");
    
        // read 3
        var list = features.get(3);
        ASSERT.strictEqual(list.length, 3, "read 3 returns 3");
        ASSERT.ok(list[0] instanceof Feature, "list contains features");
    
        // read 60 (only 49 features)
        list = features.get(60);
        ASSERT.strictEqual(list.length, 49, "49 features read");
        
        layer.workspace.close();
    
    };
};

exports["test: update"] = function(getLayer) {
    return function() {
        var layer, features, feature;
        
        layer = getLayer();
        
        features = layer.query("STATE_ABBR = 'MT'");
        ASSERT.strictEqual(features.size, 1, "got a collection of 1");
        feature = features.get(1)[0];

        // modify feature but do not persist changes
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montana", "original name");
        feature.set("STATE_NAME", "Montucky");
        
        // re-read layer
        layer = getLayer();
        features = layer.query("STATE_ABBR = 'MT'");
        ASSERT.strictEqual(features.size, 1, "got a collection of 1 (again)");
        feature = features.get(1)[0];

        // confirm that original name is still set
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montana", "same old name");
        
        // set new name
        feature.set("STATE_NAME", "Montucky");
        // and make it bigger while we're at it
        var big = feature.geometry.area;
        feature.geometry = feature.geometry.buffer(2);
        // now persist changes
        layer.update();
        
        // finally, confirm that changes stuck
        layer = getLayer();
        features = layer.query("STATE_ABBR = 'MT'");
        ASSERT.strictEqual(features.size, 1, "got a collection of 1 (again x2)");
        feature = features.get(1)[0];
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montucky", "new name");
        ASSERT.ok(feature.geometry.area > big, "bigger");
        
        layer.workspace.close();
    
    };
};

exports["test: bounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.bounds;
        ASSERT.ok(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.ok(projection instanceof PROJ.Projection, "has projection");
            ASSERT.ok(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.ok(
            bounds.equals(new GEOM.Bounds([-124.73142200000001, 24.955967, -66.969849, 49.371735, layer.projection])),
            "correct bounds for layer"
        );
    }
}

exports["test: getBounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.getBounds("STATE_ABBR = 'MT'");
        ASSERT.ok(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.ok(projection instanceof PROJ.Projection, "has projection");
            ASSERT.ok(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.ok(
            bounds.equals(new GEOM.Bounds([-116.0625, 44.35372899999999, -104.04258, 49, layer.projection])),
            "correct bounds for MT"
        );
    }
};

exports["test: query"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var count, features, feature;

        // query with a filter
        features = layer.query("STATE_ABBR EQ 'TX'");
        ASSERT.strictEqual(features.size, 1, "one TX");
    
        feature = features.get(1)[0];
        ASSERT.strictEqual(feature.get("STATE_ABBR"), "TX", "got feature with expected STATE_ABBR");
    
        var isMT = new Filter("STATE_ABBR = 'MT'");
        feature = layer.get(isMT);
        ASSERT.ok(feature instanceof Feature, "one feature is MT")
        
        var nearMT = new Filter("BBOX(the_geom, " + feature.geometry.bounds.toArray() + ")");
        
        var collection;
        collection = layer.query(nearMT);
        features = collection.get(20);
        ASSERT.strictEqual(features.length, 5, "there are 5 features near MT");

        collection = layer.query(nearMT);
        features = collection.get(3);
        ASSERT.strictEqual(features.length, 3, "got first 3 features near MT");

        collection = layer.query(nearMT.and(isMT.not));
        features = collection.get(20);
        ASSERT.strictEqual(features.length, 4, "4 features near and not MT");

        layer.workspace.close();
    };
};

exports["test: get"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var feature;

        var isMT = new Filter("STATE_ABBR = 'MT'");
        feature = layer.get(isMT);
        ASSERT.ok(feature instanceof Feature, "got feature MT with filter")
        ASSERT.strictEqual(feature.get("STATE_ABBR"), "MT", "MT has expected STATE_ABBR");

        // query with a filter
        feature = layer.get("STATE_ABBR EQ 'TX'");
        ASSERT.ok(feature instanceof Feature, "got feature TX with string");
        ASSERT.strictEqual(feature.get("STATE_ABBR"), "TX", "TX has expected STATE_ABBR");
        
        var id = feature.id;
        feature = layer.get(id);
        ASSERT.ok(feature instanceof Feature, "got feature TX with id");
        ASSERT.strictEqual(feature.get("STATE_ABBR"), "TX", "TX has expected STATE_ABBR with id");
        
    };
};


exports["test: remove"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        ASSERT.strictEqual(layer.count, 49, "49 features before remove");
    
        layer.remove("STATE_NAME = 'Illinois'");
        ASSERT.strictEqual(layer.count, 48, "48 features after remove");  

        var isTX = new Filter("STATE_ABBR = 'TX'");
        var feature = layer.get(isTX);
        ASSERT.ok(feature instanceof Feature, "got a single feature");
        layer.remove(feature);
        ASSERT.strictEqual(layer.count, 47, "47 features after remove");
        
        ASSERT.strictEqual(layer.get(isTX), null, "no more TX");
        
        layer.workspace.close();
    };
};
