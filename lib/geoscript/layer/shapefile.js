var Layer = require("geoscript/layer").Layer;
var util = require("geoscript/util");
var ShapefileDataStore = Packages.org.geotools.data.shapefile.ShapefileDataStore;

/** api: (define)
 *  module = layer
 *  class = ShapefileLayer
 */

 /** api: (extends)
  *  layer/layer.js
  */
var ShapefileLayer = util.extend(Layer, {
    
    /** api: constructor
     *  .. class:: MemoryLayer
     *
     *      :arg file: ``String`` Path to a shapefile.
     *
     *      Create a new layer based on a shapefile.
     */
    constructor: function(file) {
        Layer.prototype.constructor.apply(this, [file]);
    },
    
    /** private: method[create_]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore``
     *
     *  Create the underlying store for the layer.
     */
    create_: function(file) {
        var store = new ShapefileDataStore(
            util.toURL(file), 
            new java.net.URI("http://geoscript.org")
        );
        return store.getFeatureSource();
    }
    
});

exports.ShapefileLayer = ShapefileLayer;

