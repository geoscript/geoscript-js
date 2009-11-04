var Layer = require("geoscript/layer/layer").Layer;
var geom = require("geoscript/geom")
var feature = require("geoscript/feature");
var util = require("geoscript/util");

var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;

var MemoryLayer = util.extend(Layer, {
    
    constructor: function(config) {
        config = config || {};        
        if (!config.name) {
            config.name = "memory";
        }
        if (!config.atts) {
            config.atts = [["geom", "Geometry"]];
        }
        Layer.prototype.constructor.apply(this, [config]);
    },
    
    _create: function(config) {
        var store = new MemoryDataStore();
        store.createSchema(this.schema._schema);
        return store.getFeatureSource(config.name);
    }
    
});

exports.MemoryLayer = MemoryLayer;
