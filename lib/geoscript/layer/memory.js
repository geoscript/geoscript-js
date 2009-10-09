
var Layer = require("geoscript/layer").Layer;
var geom = require("geoscript/geom")
var feature = require("geoscript/feature");

var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;

var MemoryLayer = function(config) {
    var config = config || {};
    var schema = new feature.Schema({
        name: config.name,
        atts: {geom: "Geometry"}
    });
    var store = new MemoryDataStore(schema._ft);
    config.fs = store.getFeatureSource(schema.name);
    Layer.prototype.constructor.apply(this, [config]);
};
MemoryLayer.prototype = new Layer();
MemoryLayer.prototype.constructor = MemoryLayer;

