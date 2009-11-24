var Layer = require("geoscript/layer").Layer;
var util = require("geoscript/util");
var H2DataStoreFactory = Packages.org.geotools.data.h2.H2DataStoreFactory;

/** api: (define)
 *  module = layer
 *  class = H2Layer
 */

 /** api: (extends)
  *  layer/layer.js
  */
var H2Layer = util.extend(Layer, {
    
    /** api: constructor
     *  .. class:: H2Layer
     *
     *      :arg config: ``Object`` Layer configuration object.
     *
     *      Create a new H2 layer.
     */
    constructor: function H2Layer(config) {
        Layer.prototype.constructor.apply(this, [config]);
    },

    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore``
     *
     *  Create the underlying store for the layer.
     */
    _create: function(config) {
        var factory = new H2DataStoreFactory();
        var store = factory.createDataStore({
            database: config.database,
            dbtype: "h2"
        });
        return store.getFeatureSource(config.table);        
    }

});

exports.H2Layer = H2Layer;
