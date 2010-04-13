var ASSERT = require("test/assert");
var Feature = require("geoscript/feature").Feature;
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: features"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var count, features, feature;
    
        // get all features
        features = layer.features;
        count = layer.count;

        ASSERT.isTrue(features.hasNext(), "hasNext returns true");
    
        var log = [];
        var testScope = {};
        features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

        ASSERT.is(count, log.length, "forEach calls block once for each feature");
        ASSERT.isTrue(log[0].args[0] instanceof Feature, "forEach calls block with feature");
        ASSERT.is(testScope, log[0].scope, "forEach calls block with correct scope");
    
        ASSERT.isTrue(!features.hasNext(), "after forEach, hasNext returns false");
        ASSERT.is(undefined, features.next(), "if not hasNext, next returns undefined");
    
        // test some additional cursor properties
        features = layer.features;
        ASSERT.is(-1, features.index, "index is -1 to start");
        ASSERT.is(null, features.current, "current is null before read");
    
        // read 1 - index: 0
        feature = features.next();
        ASSERT.isTrue(feature instanceof Feature, "0: next reads a feature");
        ASSERT.is(0, features.index, "0: index is 0 after 1 read");
        ASSERT.isTrue(feature === features.current, "0: current feature set to most recently read");
    
        // skip 3 - index: 3
        features.skip(3);
        ASSERT.is(3, features.index, "3: index is 3 after skip");
        ASSERT.isTrue(feature === features.current, "3: current feature is still last read");
    
        // read 3 - index: 6
        var list = features.read(3);
        ASSERT.is(3, list.length, "6: read 3 returns 3");
        ASSERT.isTrue(list[0] instanceof Feature, "6: list contains features");
        ASSERT.isTrue(list[2] === features.current, "6: current is most recetly read");
    
        // skip 40 - index: 46
        features.skip(40);
        ASSERT.is(46, features.index, "46: index is 46 after skip");
    
        // read 10 - index: 48 (only 49 features)
        list = features.read(10);
        ASSERT.is(48, features.index, "48: index is 48 after exhausting cursor");
        ASSERT.is(2, list.length, "48: 2 features read");
        ASSERT.is(null, features.current, "48: current is null after closing cursor");
        
        layer.workspace.close();
    
    };
};

exports["test: bounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.bounds;
        ASSERT.isTrue(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.isTrue(projection instanceof PROJ.Projection, "has projection");
            ASSERT.isTrue(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.isTrue(
            bounds.equals(GEOM.Bounds.fromArray([-124.73142200000001, 24.955967, -66.969849, 49.371735], layer.projection)),
            "correct bounds for layer"
        );
    }
}

exports["test: getBounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.getBounds("STATE_ABBR = 'MT'");
        ASSERT.isTrue(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.isTrue(projection instanceof PROJ.Projection, "has projection");
            ASSERT.isTrue(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.isTrue(
            bounds.equals(GEOM.Bounds.fromArray([-116.0625, 44.35372899999999, -104.04258, 49], layer.projection)),
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
        ASSERT.isTrue(features.hasNext(), "hasNext returns true");
    
        feature = features.next();
        ASSERT.is("TX", feature.get("STATE_ABBR", "got feature with expected STATE_ABBR"));
    
        ASSERT.isFalse(features.hasNext(), "only one feature in query results");    

        layer.workspace.close();        
    };
};

exports["test: remove"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        ASSERT.is(49, layer.count, "49 features before remove");
    
        layer.remove("STATE_NAME = 'Illinois'");
        ASSERT.is(48, layer.count, "48 features after remove");  
        
        layer.workspace.close();
    };
};
