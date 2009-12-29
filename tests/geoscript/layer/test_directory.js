var assert = require("test/assert");
var layer = require("geoscript/layer");
var Feature = require("geoscript/feature").Feature;

var admin = require("../../admin");

var shpDir = admin.shp.dest;
exports.setup = admin.shp.setup;
exports.teardown = admin.shp.teardown;

exports["test: count"] = function() {

    var shp = new layer.Layer({
        workspace: shpDir,
        name: "states"
    });
    assert.is(49, shp.count, "correct count");
    
};

exports["test: temporary"] = function() {
    
    var shp = new layer.Layer({
        workspace: shpDir,
        name: "states"
    });
    assert.isFalse(shp.temporary);
    
};

exports["test: features"] = function() {

    var shp = new layer.Layer({
        workspace: shpDir,
        name: "states"
    });
    var count, features, feature;
    
    // call features with no filter
    features = shp.features();
    count = shp.count;
        
    assert.isTrue(features.hasNext(), "hasNext returns true");
    
    var log = [];
    var testScope = {};
    features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

    assert.is(count, log.length, "forEach calls block once for each feature");
    assert.isTrue(log[0].args[0] instanceof Feature, "forEach calls block with feature");
    assert.is(testScope, log[0].scope, "forEach calls block with correct scope");
    
    assert.isTrue(!features.hasNext(), "after forEach, hasNext returns false");
    assert.is(undefined, features.next(), "if not hasNext, next returns undefined")
    
    // query with a filter
    features = shp.features({filter: "STATE_ABBR EQ 'TX'"});
    assert.isTrue(features.hasNext(), "[filter] hasNext returns true");
    
    feature = features.next();
    assert.is("TX", feature.get("STATE_ABBR", "[filter] got feature with expected STATE_ABBR"));
    
    assert.isFalse(features.hasNext(), "[filter] only one feature in query results");    
    
};

if (require.main === module.id) {
    require("test/runner").run(exports);
}
