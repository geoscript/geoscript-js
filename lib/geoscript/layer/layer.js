var Feature = require("geoscript/feature").Feature;
var Schema = require("geoscript/feature").Schema;
var util = require("geoscript/util");
var Cursor = require("geoscript/cursor").Cursor;

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cql2.CQL;
var Filter = Packages.org.opengis.filter.Filter

/** api: (define)
 *  module = layer
 *  class = Layer
 */
var Layer = util.extend(Object, {
    
    /** private: property[schema]
     *  :class:`feature.Schema`
     */
    schema: null,
    
    /** api: constructor
     *  .. class:: Layer
     *
     *      A Layer instance should not be created directly.  
     *      Create an instance of a Layer subclass instead.
     */
    constructor: function Layer(config) {
        if (config) {
            this._source = this._create(config);
            this.init();
        }
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore``
     *
     *  Create the underlying store for the layer.
     */
    _create: function(config) {
        throw new Error("Layer subclasses must implement _create.");
    },
    
    /** private: method[init]
     *  Called after _source has been set.
     */
    init: function() {
        this.schema = Schema.from_(this._source.getSchema());
    },
    
    /** api: property[name]
     *  ``String``
     *  The layer name.
     */
    get name() {
        return this._source.getName().getLocalPart();
    },
    
    /** api: property[count]
     *  ``Number``
     *  The number of features contained in the layer.
     */
    get count() {
        return this._source.getCount(Query.ALL);
    },
    
    /** private: property[bounds]
     *  ``geotools``
     *  TODO: Provide a geoscript wrapper for this.
     */
    get bounds() {
        return this._source.bounds;
    },

    /** api: method[features]
     *  :arg options: ``Object``
     *  :returns: ``Object`` A generator-like object for accessing features.
     *
     *  Valid options:
     *
     *  * filter - ``String`` Filter for the feature query specified in CQL.
     *
     *  Query for features from the layer.  The return will be an object with
     *  ``forEach``, ``hasNext``, and ``next`` methods.
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      layer.features().forEach(function(feature) {
     *          print(feature.toString());
     *      });
     */
    features: function(options) {
        options = options || {};
        var filter;
        if (options.filter) {
            filter = CQL.toFilter(options.filter);
        } else {
            filter = Filter.INCLUDE;
        }
        var query = new DefaultQuery(this.name, filter);
        var results = this._source.dataStore.getFeatureReader(query, Transaction.AUTO_COMMIT);
        var _schema = this.schema._schema;
        
        var cursor = new Cursor(results, function(_feature) {
            return Feature.from_(_feature, _schema);
        });
        
        return cursor;
    },
    
    /** api: method[add]
     *  :arg obj: ``Object`` A :class:`feature.Feature` or a feature attribute 
     *      values object.
     *
     *  Add a feature to a layer.  Optionally, an object with feature attribute
     *  values may be provided.
     */
    add: function(obj) {
        var feature;
        if (obj instanceof Feature) {
            feature = obj;
        } else {
            // has to be a values object
            feature = new Feature({schema: this.schema, values: obj});
        }
        
        var collection = FeatureCollections.newCollection();
        collection.add(feature._feature);
        this._source.addFeatures(collection);
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "name: " + this.name + ", count: " + this.count;
    }
    
});

Layer.from_ = function(_source) {
    var layer = new Layer();
    layer._source = _source;
    layer.init();
    return layer;
}

exports.Layer = Layer;
