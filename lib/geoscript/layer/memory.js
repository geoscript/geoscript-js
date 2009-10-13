var Layer = require("geoscript/layer/layer").Layer;
var geom = require("geoscript/geom")
var feature = require("geoscript/feature");
var util = require("geoscript/util");

var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;

var MemoryLayer = util.extend(Layer, {
    
    constructor: function(config) {
        var config = config || {};

        this.schema = new feature.Schema({
            name: config.name,
            atts: [["geom", "Geometry"]]
        });

        var store = new MemoryDataStore(this.schema._schema);
        config.source = store.getFeatureSource(this.schema._schema.name);
        Layer.prototype.constructor.apply(this, [config]);
    }
    
});

exports.MemoryLayer = MemoryLayer;
