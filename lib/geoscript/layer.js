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

var UTIL = require("./util");
UTIL.createRegistry(exports);

var Feature = require("./feature").Feature;
var FILTER = require("./filter");
var Schema = require("./feature").Schema;
var Cursor = require("./cursor").Cursor;
var WORKSPACE = require("./workspace");
var PROJ = require("./proj");
var GEOM = require("./geom");

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cql2.CQL;

// TODO: remove when changed in GeoTools
// supress info about "Building quadtree spatial index with depth 3 for file" 
var logger = geotools.util.logging.Logging.getLogger(
    "org.geotools.data.shapefile"
);
logger.setLevel(java.util.logging.Level.WARNING); 

var getTempName = function() {
    var count = WORKSPACE.memory.names.length;
    var name = "layer_" + count;
    while (WORKSPACE.memory.names.indexOf(name) > -1) {
        ++count;
        name = "layer_" + count;
    }
    return name;
};

/** api: class = Layer */
var Layer = UTIL.extend(Object, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,

    /** api: constructor
     *  .. class:: Layer
     *
     *      Create a new layer.  If a workspace is not provided, a temporary
     *      layer will be created.  If a layer is created without a schema, a
     *      default schema will be applied.
     *
     *      The following are equivalent ways of constructing a temporary layer
     *      with a simple schema:
     *
     *      .. code-block:: javascript
     *
     *          js> var layer = new LAYER.Layer({name: "temp"});
     *
     *          js> var layer = new LAYER.Layer({
     *            >     name: "temp",
     *            >     fields: [{name: "geom", type: "Geometry"}]
     *            > });
     *
     *          js> var FEATURE = require("geoscript/feature");
     *          js> var schema = new FEATURE.Schema({
     *            >     name: "temp",
     *            >     fields: [{name: "geom", type: "Geometry"}]
     *            > });
     *          js> var layer = new LAYER.Layer({schema: schema});
     */
    constructor: function Layer(config) {
        this.cache = {};
        var name;
        if (config) {
            var schema = config.schema;
            var name = config.name || getTempName();
            if (!schema) {
                schema = new Schema({
                    name: name,
                    fields: config.fields || [{name: "geom", type: "Geometry"}]
                });
            }
            if (config.workspace) {
                if (config.workspace instanceof WORKSPACE.Workspace) {
                    this.workspace = config.workspace;
                } else {
                    this.workspace = WORKSPACE.create(config.workspace);
                }
                name = config.name;
            } else {
                this.workspace = WORKSPACE.memory;
                this.workspace._store.createSchema(schema._schema);
                name = schema.name;
            }
            if (!name) {
                throw "Layer configuration must include a name or a named schema.";
            }
            this._source = this.workspace._store.getFeatureSource(name);
            var projection = config.projection;
            if (projection) {
                this.projection = projection;
            }
        }
    },
    
    /** api: method[get]
     *  :arg id: ``String`` Feature identifier.
     *  :returns: :class:`feature.Feature`
     *
     *  Get a single feature using the feature id.
     */
    get: function(id) {
        var filter = FILTER.fids([id]);
        var cursor = this.query(filter);
        var feature = cursor.next();
        cursor.close();
        return feature;
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
        if (WORKSPACE.memory.names.indexOf(name) > -1) {
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
        if (!(projection instanceof PROJ.Projection)) {
            projection = new PROJ.Projection(projection);
        }
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
        return (this.workspace instanceof WORKSPACE.Memory);
    },
    
    /** api: property[name]
     *  ``String``
     *  The layer name.
     */
    get name() {
        return String(this._source.getName().getLocalPart());
    },
    
    /** api: method[getCount]
     *  :arg filter: :class:`filter.Filter` Optional filter or CQL string.
     *  :returns: ``Number``
     *
     *  Get the number of features on the layer matching the given filter.
     */
    getCount: function(filter) {
        if (filter) {
            if (!(filter instanceof FILTER.Filter)) {
                filter = new FILTER.Filter(filter);
            }
        } else {
            filter = FILTER.Filter.PASS;
        }
        var count = this._source.getCount(DefaultQuery(this.name, filter._filter));
        if (count === -1) {
            // count manually for layers that don't support this query
            count = 0;
            this.features.forEach(function(feature) {
                if (filter.evaluate(feature)) {
                    ++count;
                }
            });
        }
        return count;
    },
    
    /** api: property[count]
     *  ``Number``
     *  The number of features contained in the layer.
     */
    get count() {
        return this._source.getCount(Query.ALL);
    },
    
    /** api: method[getBounds]
     *  :arg filter: :class:`filter.Filter` Optional filter or CQL string.
     *  :returns: :class:`geom.Bounds`
     *
     *  Get the bounds for all features on the layer.  Optionally, the bounds
     *  can be generated for all features that match the given filter.
     */
    getBounds: function(filter) {
        if (filter) {
            if (!(filter instanceof FILTER.Filter)) {
                filter = new FILTER.Filter(filter);
            }
        } else {
            filter = FILTER.Filter.PASS;
        }
        var bounds;
        var _bounds = this._source.getBounds(DefaultQuery(this.name, filter._filter));
        if (_bounds) {
            bounds = GEOM.Bounds.from_(_bounds);
        }
        return bounds;
    },
    
    /** api: property[bounds]
     *  :class:`geom.Bounds`
     *  The bounds for all features on this layer.
     */
    get bounds() {
        return this.getBounds();
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
            filter = FILTER.Filter.PASS;
        } else {
            if (!(filter instanceof FILTER.Filter)) {
                // must be CQL string
                filter = new FILTER.Filter(filter);
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
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> var GEOM = require("geoscript/geom");
     *      js> layer.add({geom: new GEOM.Point([0, 1])});
     *      
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
                    feature.geometry = PROJ.transform(
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
    
    /** api: method[remove]
     *  :arg filter: :class:`filter.Filter` or ``String``
     *
     *  Remove features from a layer that match the given filter or CQL string.
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> var GEOM = require("geoscript/geom");
     *      js> layer.add({geom: new GEOM.Point([1, 2])});
     *      js> layer.remove("INTERSECTS(geom, POINT(1 2))");
     *  
     */
    remove: function(filter) {
        if (!filter) {
            filter = FILTER.Filter.FAIL;
        }
        if (!(filter instanceof FILTER.Filter)) {
            filter = new FILTER.Filter(filter);
        }
        this._source.removeFeatures(filter._filter);
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "name: " + this.name + ", count: " + this.count;
    }
    
});

Layer.from_ = function(_source, workspace) {
    var layer = new Layer();
    layer._source = _source;
    layer.workspace = workspace;
    return layer;
}

/** api: example
 *  Sample code to create a temporary layer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var layer = new LAYER.Layer({name: "temp"});
 */

exports.Layer = Layer;

// register a layer factory for the module
var Factory = require("./factory").Factory;

exports.register(new Factory(Layer, {
    handles: function(config) {
        return true;
    }
}));
