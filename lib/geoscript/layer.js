/** api: module = layer */

/** api: synopsis
 *  Layer related functionality.
 */

/** api: summary
 *  The :mod:`layer` module provides a constructor for Layer objects.
 *
 *  .. code-block:: javascript
 *  
 *      js> var LAYER = require("geoscript/layer");
 */

var util = require("geoscript/util");
util.createRegistry(exports);

var Feature = require("geoscript/feature").Feature;
var Filter = require("geoscript/filter").Filter;
var Schema = require("geoscript/feature").Schema;
var util = require("geoscript/util");
var Cursor = require("geoscript/cursor").Cursor;
var workspace = require("geoscript/workspace");
var proj = require("geoscript/proj");

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cql2.CQL;

var getTempName = function() {
    var count = workspace.memory.names.length;
    var name = "layer_" + count;
    while (workspace.memory.names.indexOf(name) > -1) {
        ++count;
        name = "layer_" + count;
    }
    return name;
};

/** api: class = Layer */
var Layer = util.extend(Object, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,

    /** api: constructor
     *  .. class:: Layer
     *
     *      Create a new layer.  If a workspace is not provided, a temporary
     *      layer will be created.
     */
    constructor: function Layer(config) {
        this.cache = {};
        var name;
        if (config) {
            if (config.workspace) {
                if (config.workspace instanceof workspace.Workspace) {
                    this.workspace = config.workspace;
                } else {
                    this.workspace = workspace.create(config.workspace);
                }
                name = config.name;
            } else {
                this.workspace = workspace.memory;
                var schema = config.schema;
                if (!schema) {
                    schema = new Schema({
                        name: config.name || getTempName(),
                        fields: config.fields || [{name: "geom", type: "Geometry"}]
                    });
                }
                this.workspace._store.createSchema(schema._schema);
                name = schema.name;
            }
            if (!name) {
                throw "Layer configuration must include a name or a named schema.";
            }
            this._source = this.workspace._store.getFeatureSource(name);
            var projection = config.projection;
            if (projection) {
                if (projection instanceof proj.Projection) {
                    projection = new proj.Projection(projection);
                }
                this.projection = projection;
            }
        }
    },

    /** api: method[clone]
     *  :arg name: ``String`` New layer name.  If not provided, one will be
     *      generated.
     *  :returns: :class:`layer.Layer` The layer clone.
     *
     *  Create a temporary copy of this layer.
     */
    clone: function(name) {
        name = name || getTempName();
        if (workspace.memory.names.indexOf(name) > -1) {
            throw "Layer named '" + name + "' already exists.";
        }
        var schema = this.schema.clone(name);
        var layer = new Layer({schema: schema});
        this.features.forEach(layer.add, layer);
        return layer;
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
    
    /** api: property[projection]
     *  :class:`proj.Projection`
     *  Optional projection for the layer.  If set, any features added to the
     *  layer will be tranformed to this projection if they are in a different
     *  projection.  This must be set before features are added to the layer.
     */
    get projection() {
        var projection = this.cache.projection;
        if (!projection && this.schema) {
            var field = this.schema.geometry;
            if (field) {
                projection = field.projection;
                this.cache.projection = projection;
            }
        }
        return projection;
    },
    set projection(projection) {
        projection = new proj.Projection(projection);
        if (this.projection && !projection.equals(this.projection)) {
            throw "Layer projection already set: " + this.projection.id;
        }
        this.cache.projection = projection;
    },
    
    /** api: property[temporary]
     *  ``Boolean``
     *  The layer has not been persisted to a workspace.
     */
    get temporary() {
        return (this.workspace instanceof workspace.Memory);
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

    /** api: method[query]
     *  :arg filter: ``filter.Filter or String`` A filter or a CQL string.
     *  :returns: :class:`cursor.Cursor` A cursor for accessing queried features.
     *
     *  Query for features from the layer.  The return will be an object with
     *  ``forEach``, ``hasNext``, and ``next`` methods.  If no filter is
     *  provided, all features will be included in the results.
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> layer.query("name = 'foo'").forEach(function(feature) {
     *        >     print(feature.toString());
     *        > });
     */
    query: function(filter) {
        if (!filter) {
            filter = Filter.PASS;
        } else {
            if (!(filter instanceof Filter)) {
                // must be CQL string
                filter = new Filter(filter);
            }
        }
        var query = new DefaultQuery(this.name, filter._filter);
        var results = this._source.dataStore.getFeatureReader(query, Transaction.AUTO_COMMIT);
        var _schema = this.schema._schema;
        
        var cursor = new Cursor(results, function(_feature) {
            return Feature.from_(_feature, _schema);
        });
        
        return cursor;
    },
    
    /** api: property[features]
     *  :class:`cursor.Cursor`
     *  A cursor object for accessing all features on the layer.
     *
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> layer.features.forEach(function(feature) {
     *        >     print(feature.toString());
     *        > });
     */
    get features() {
        return this.query();
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
        if (this.projection) {
            if (feature.projection) {
                if (!this.projection.equals(feature.projection)) {
                    feature.geometry = proj.transform(
                        feature.geometry,
                        feature.projection,
                        this.projection
                    );
                }
            } else {
                feature.projection = this.projection;
            }
        }
        this.workspace._onFeatureAdd(feature);
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

/** api: example
 *  Sample code to create a temporary layer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var layer = new LAYER.Layer();
 */

exports.Layer = Layer;

// register a layer factory for the module
var Factory = require("geoscript/factory").Factory;

exports.register(new Factory(Layer, {
    handles: function(config) {
        return true;
    }
}));
