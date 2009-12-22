//exports["test: MemoryLayer"] = require("./layer/test_memory");
//exports["test: Shapefile"] = require("./layer/test_shapefile");

var assert = require("test/assert");
var layer = require("geoscript/layer");

exports["test: create(shapefile)"] = function() {
    
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var shp = layer.create({
        workspace: path,
        name: "states"
    });
    
    assert.isTrue(shp instanceof layer.Layer, "instanceof Layer");
    assert.is(49, shp.count, "49 features");
    
};

exports["test: create(memory)"] = function() {
    
    var file = require("file");
    var path = file.resolve(module.path, "../data");
    
    var mem = layer.create({});
    
    assert.isTrue(mem instanceof layer.Layer, "instanceof Layer");
    assert.isTrue(mem.temporary, "temporary layer");
    
};

exports["test: Layer"] = require("./layer/test_layer");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
