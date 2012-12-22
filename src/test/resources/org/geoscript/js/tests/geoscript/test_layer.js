var ASSERT = require("assert");
var LAYER = require("geoscript/layer");
var GEOM = require("geoscript/geom");
var ADMIN = require("../admin");
var Directory = require("geoscript/workspace").Directory;

var shpDir = ADMIN.shp.dest;
exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

exports["test: Layer.constructor"] = function() {

    var l = new LAYER.Layer();
    ASSERT.ok(l instanceof LAYER.Layer, "instanceof LAYER.Layer");

};

exports["test: Layer.clone"] = function() {

    var clone;
    var temp = new LAYER.Layer({
        name: "foo", 
        fields: [{name: "bar", type: "String"}]
    });

    // create a clone without providing a name
    clone = temp.clone();
    ASSERT.ok(clone instanceof LAYER.Layer, "clone is a LAYER.Layer");
    ASSERT.ok(typeof clone.name === "string", "clone has a name");
    ASSERT.ok(clone.name !== temp.name, "clone gets a new name");
    
    // create a clone with a new name
    clone = temp.clone("bar");
    ASSERT.strictEqual(clone.name, "bar", "clone can be given a new name");
    
    // clone an existing layer with features
    var shp = Directory(shpDir).get("states");
    
    clone = shp.clone();
    ASSERT.ok(clone.temporary, "clone is a temporary layer");
    ASSERT.strictEqual(clone.count, shp.count, "clone has same count as original");

};

exports["test: create(memory)"] = function() {
    
    var mem = LAYER.create({fields: [{name: "foo", type: "String"}]});
    
    ASSERT.ok(mem instanceof LAYER.Layer, "instanceof LAYER.Layer");
    ASSERT.ok(mem.temporary, "temporary layer");
    
};

exports["test: (Shapefile)"] = require("./layer/test_shapefile");
// TODO: determine why layer.update test is failing for H2
// exports["test: (H2)"] = require("./layer/test_h2");
// TODO: add test setup to create temp db
// exports["test: (PostGIS)"] = require("./layer/test_postgis");
exports["test: (Memory)"] = require("./layer/test_memory");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
