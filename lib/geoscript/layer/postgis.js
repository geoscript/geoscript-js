var Layer = require("geoscript/layer").Layer;
var util = require("geoscript/util");
var PostgisDataStoreFactory = Packages.org.geotools.data.postgis.PostgisDataStoreFactory;

/** api: (define)
 *  module = layer
 *  class = PostGISLayer
 */

 /** api: (extends)
  *  layer/layer.js
  */
var PostGISLayer = util.extend(Layer, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        host: "localhost",
        port: java.lang.Integer(5432),
        schema: "public",
        user: "postgres",
        passwd: "postgres",
        dbtype: "postgis"
    },
    
    /** api: constructor
     *  .. class:: PostGISLayer
     *
     *      :arg config: ``Object`` Layer configuration object.
     *
     *      Create a new PostGIS layer.
     */
    constructor: function PostGISLayer(config) {
        Layer.prototype.constructor.apply(this, [config]);
    },

    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore``
     *
     *  Create the underlying store for the layer.
     */
    _create: function(config) {
        var factory = new PostgisDataStoreFactory();
        if (typeof config.port === "number") {
            config.port = java.lang.Integer(config.port);
        }
        var store = factory.createDataStore(util.applyIf(config, this.defaults));
        return store.getFeatureSource(config.table);        
    }

});

exports.PostGISLayer = PostGISLayer;
