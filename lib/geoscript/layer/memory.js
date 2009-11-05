var Layer = require("geoscript/layer/layer").Layer;
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
        if (!config.name) {
            config.name = "temp";
        }
        if (!config.fields) {
            config.fields = [{name: "geom", type: "Geometry"}];
        }
        Layer.prototype.constructor.apply(this, [config]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *
     *  Create the underlying source for this layer.
     */
    _create: function(config) {
        var store = new MemoryDataStore();
        store.createSchema(this.schema._schema);
        return store.getFeatureSource(config.name);
    }
    
});

exports.MemoryLayer = MemoryLayer;
