var Feature = require("geoscript/feature").Feature;
var Schema = require("geoscript/feature").Schema;
var util = require("geoscript/util");
var Cursor = require("geoscript/cursor").Cursor;
var workspace = require("geoscript/workspace");

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cql2.CQL;
var Filter = Packages.org.opengis.filter.Filter

var tempId = 0;
var getTempName = function() {
    ++tempId;
    return "temp_" + tempId;
};

/** api: (define)
 *  module = layer
 *  class = Layer
 */
var Layer = util.extend(Object, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,
    
    /** api: constructor
     *  .. class:: Layer
     *
     *      A Layer instance should not be created directly.  
     *      Create an instance of a Layer subclass instead.
     */
    constructor: function Layer(config) {
        this.cache = {};
        if (config) {
            if (config.workspace) {
                if (config.workspace instanceof workspace.Workspace) {
                    this.workspace = config.workspace;
                } else {
                    this.workspace = workspace.create(config.workspace);
                }
            } else {
                this.workspace = workspace.memory;
                if (!config.schema) {
                    util.applyIf(config, {
                        name: getTempName(),
                        fields: [{name: "geom", type: "Geometry"}]
                    });
                    config.schema = new Schema({
                        name: config.name,
                        fields: config.fields
                    });
                }
                this.workspace._store.createSchema(config.schema._schema);
            }
            this._source = this.workspace._store.getFeatureSource(config.name);
        }
    },
    
    /** api: property[schema]
     *  :class:`feature.Schema`
     *  The schema for this layer.
     */
    get schema() {
        if (!this.cache.schema) {
            this.cache.schema = Schema.from_(this._source.getSchema());
        }
        return this.cache.schema;
    },
    
    /** api: property[temporary]
     *  ``Boolean``
     *  The layer has not been persisted to a workspace.
     */
    get temporary() {
        return (this.workspace instanceof workspace.MemoryWorkspace);
    },
    
    /** api: property[name]
     *  ``String``
     *  The layer name.
     */
    get name() {
        return String(this._source.getName().getLocalPart());
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

Layer.from_ = function(_source, work) {
    var layer = new Layer();
    layer._source = _source;
    layer.workspace = work;
    return layer;
}

exports.Layer = Layer;

// register a layer factory for the module
var layer = require("geoscript/layer");
var Factory = require("geoscript/factory").Factory;

layer.register(new Factory(Layer, {
    handles: function(config) {
        return true;
    }
}));
