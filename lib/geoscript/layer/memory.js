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
        if (!config.schema) {
            config.schema = new Schema({
                name: config.name || "temp",
                fields: config.fields || [{name: "geom", type: "Geometry"}]
            });
        }
        Layer.prototype.constructor.apply(this, [config]);
    },
    
    /** private: method[create_]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore``
     *
     *  Create the underlying store for the layer.
     */
    create_: function(config) {
        var store = new MemoryDataStore();
        store.createSchema(config.schema._schema);
        return store.getFeatureSource(config.schema.name);        
    }
        
});

exports.MemoryLayer = MemoryLayer;
