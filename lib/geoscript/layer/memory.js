var Layer = require("geoscript/layer/layer").Layer;
var Schema = require("geoscript/feature").Schema;
var geom = require("geoscript/geom")
var feature = require("geoscript/feature");
var util = require("geoscript/util");

var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;

/** api: (define)
 *  module = layer
 *  class = MemoryLayer
 */

 /** api: (extends)
  *  layer/layer.js
  */
var MemoryLayer = util.extend(Layer, {
    
    /** api: constructor
     *  .. class:: MemoryLayer
     *
     *      :arg config: ``Object`` Layer configuration object.
     *
     *      Create a new temporary layer in memory.
     */
    constructor: function MemoryLayer(config) {
        config = config || {};
        if (config.schema) {
            this.schema = config.schema;
        } else {
            // require name and fields
            this.schema = new Schema({
                name: config.name || "temp",
                fields: config.fields || [{name: "geom", type: "Geometry"}]
            });
        }
        var store = new MemoryDataStore();
        store.createSchema(this.schema._schema);
        this._source = store.getFeatureSource(this.schema.name);        
        this.name = this._source.getName().getLocalPart();
        Layer.prototype.constructor.apply(this, [config]);
    }
        
});

exports.MemoryLayer = MemoryLayer;
