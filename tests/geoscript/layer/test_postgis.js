var ASSERT = require("assert");
var Feature = require("geoscript/feature").Feature;
var Layer = require("geoscript/layer").Layer;

var getLayer = function() {
    return new Layer({
        workspace: {type: "postgis", database: "geoscript"},
        name: "states"
    });
};

exports["test: features"] = function() {
    var layer = getLayer();
    var count, features, feature;

    // get all features
    features = layer.features;
    count = layer.count;

    ASSERT.ok(features.hasNext(), "hasNext returns true");

    var log = [];
    var testScope = {};
    features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

    ASSERT.strictEqual(log.length, count, "forEach calls block once for each feature");
    ASSERT.ok(log[0].args[0] instanceof Feature, "forEach calls block with feature");
    ASSERT.strictEqual(log[0].scope, testScope, "forEach calls block with correct scope");

    ASSERT.ok(!features.hasNext(), "after forEach, hasNext returns false");
    ASSERT.strictEqual(features.next(), undefined, "if not hasNext, next returns undefined");

    // test some additional cursor properties
    features = layer.features;
    ASSERT.strictEqual(features.index, -1, "index is -1 to start");
    ASSERT.strictEqual(features.current, null, "current is null before read");

    // read 1 - index: 0
    feature = features.next();
    ASSERT.ok(feature instanceof Feature, "0: next reads a feature");
    ASSERT.strictEqual(features.index, 0, "0: index is 0 after 1 read");
    ASSERT.ok(feature === features.current, "0: current feature set to most recently read");

    // skip 3 - index: 3
    features.skip(3);
    ASSERT.strictEqual(features.index, 3, "3: index is 3 after skip");
    ASSERT.ok(feature === features.current, "3: current feature is still last read");

    // read 3 - index: 6
    var list = features.read(3);
    ASSERT.strictEqual(list.length, 3, "6: read 3 returns 3");
    ASSERT.ok(list[0] instanceof Feature, "6: list contains features");
    ASSERT.ok(list[2] === features.current, "6: current is most recetly read");

    // skip 40 - index: 46
    features.skip(40);
    ASSERT.strictEqual(features.index, 46, "46: index is 46 after skip");

    // read 10 - index: 48 (only 49 features)
    list = features.read(10);
    ASSERT.strictEqual(features.index, 48, "48: index is 48 after exhausting cursor");
    ASSERT.strictEqual(list.length, 2, "48: 2 features read");
    ASSERT.strictEqual(features.current, null, "48: current is null after closing cursor");
    
    layer.workspace.close();
};

exports["test: query"] = function() {
    var layer = getLayer();
    var count, features, feature;

    // query with a filter
    features = layer.query("STATE_ABBR EQ 'TX'");
    ASSERT.ok(features.hasNext(), "hasNext returns true");

    feature = features.next();
    ASSERT.strictEqual(feature.get("STATE_ABBR"), "TX", "got feature with expected STATE_ABBR");

    ASSERT.isFalse(features.hasNext(), "only one feature in query results");    

    layer.workspace.close();        
};

// exports["test: remove"] = function() {
//     var layer = getLayer();
//     ASSERT.strictEqual(layer.count, 49, "49 features before remove");
// 
//     layer.remove("STATE_NAME = 'Illinois'");
//     ASSERT.strictEqual(layer.count, 48, "48 features after remove");  
//     
//     layer.workspace.close();
// };

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
