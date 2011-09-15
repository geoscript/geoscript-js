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
var GeoObject = require("./object").GeoObject;
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;

var Feature = require("./feature").Feature;
var FILTER = require("./filter");
var Schema = require("./feature").Schema;
var Cursor = require("./cursor").Cursor;
var WORKSPACE = require("./workspace");
var PROJ = require("./proj");
var GEOM = require("./geom");
var STYLE = require("./style");

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cql2.CQL;
var FilterFactory2 = geotools.factory.CommonFactoryFinder.getFilterFactory2(geotools.factory.GeoTools.getDefaultHints());


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
var Layer = UTIL.extend(GeoObject, {
    
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
     */
    constructor: function Layer(config) {
        this.cache = {};
        var name;
        if (typeof config === "string") {
            config = {name: config};
        }
        if (config) {
            var schema = config.schema;
            name = config.name || (schema && schema.name) || getTempName();
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
            } else {
                this.workspace = WORKSPACE.memory;
                if (WORKSPACE.memory.names.indexOf(name) > -1) {
                    throw new Error("Temporary layer named '" + name + "' already exists.");
                }
                this.workspace._store.createSchema(schema._schema);
            }
            this._source = this.workspace._store.getFeatureSource(name);
            var projection = config.projection;
            if (projection) {
                this.projection = projection;
            }
            if (config.title) {
                this.title = config.title;
            }
            if (config.style) {
                this.style = config.style;
            }
        }
    },
    
    /** api: method[get]
     *  :arg id: ``String || Filter`` Feature identifier.  Alternatively you can
     *      provide an arbitrary filter.  In the case of a filter, only the 
     *      first feature in the resulting query will be returned.
     *  :returns: :class:`feature.Feature`
     *
     *  Get a single feature using the feature id.
     */
    get: function(id) {
        var filter;
        if (id instanceof FILTER.Filter) {
            filter = id;
        } else {
            try {
                filter = new FILTER.Filter(id);
            } catch (err) {
                filter = FILTER.fids([id]);
            }
        }
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
            throw new Error("Layer named '" + name + "' already exists.");
        }
        var schema = this.schema.clone({name: name});
        var layer = new Layer({schema: schema});
        this.features.forEach(function(feature) {
            layer.add(feature.clone());
        });
        return layer;
    },
    
    /** api: config[style]
     *  :class:`style.Style`
     *  Optional style to be used when rendering this layer as part of a map.
     *  In addition to a style instance, a style config object can be provided.
     */
    set style(style) {
        if (!(style instanceof STYLE.Style)) {
            if (style instanceof STYLE.Symbolizer) {
                style = new STYLE.Style([style]);
            } else {
                throw new Error("Style must be set to a Style or Symbolizer");
            }
        }
        this.cache.style = style;
    },
    /** api: property[style]
     *  :class:`style.Style`
     *  The style to be used when rendering this layer as part of a map.
     */
    get style() {
        if (!this.cache.style) {
            // set up the default style
            var geomName = this.schema.geometry.name;
            this.style = new STYLE.Style({parts: [
                new STYLE.Fill("#FFFFEF"),
                new STYLE.Stroke({brush: "#504673", width: 0.5}),
                new STYLE.Shape({name: "circle", fill: "#FFE1A8", size: 6})
                    .where("geometryType(" + geomName + ") = 'Point'")
            ]});
        }
        return this.cache.style;
    },
    
    /** api: property[schema]
     *  :class:`feature.Schema`
     *  The schema for this layer (read-only).
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
     *  The layer has not been persisted to a workspace (read-only).
     */
    get temporary() {
        return (this.workspace instanceof WORKSPACE.Memory);
    },
    
    /** api: property[name]
     *  ``String``
     *  The layer name.
     */
    /** api: property[name]
     *  ``String``
     *  The layer name (read-only).
     */
    get name() {
        return String(this._source.getName().getLocalPart());
    },
    
    /** api: config[title]
     *  ``String``
     *  Optional title for the layer.
     */
    set title(title) {
        this.cache.title = title;
    },
    /** api: property[title]
     *  ``String``
     *  The layer title.  Defaults to the layer name.
     */
    get title() {
        var title = this.cache.title;
        if (!title) {
            title = this.name;
        }
        return title;
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
        var count = this._source.getCount(new DefaultQuery(this.name, filter._filter));
        if (count === -1) {
            // count manually for layers that don't support this query
            count = 0;
            this.query(filter).forEach(function(feature) {
                ++count;
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
        var _bounds = this._source.getBounds(new DefaultQuery(this.name, filter._filter));
        if (_bounds) {
            bounds = GEOM.Bounds.from_(_bounds);
        } else {
            // manually calculate bounds for layers that don't support getBounds with a filter
            this.features.forEach(function(feature) {
                if (filter.evaluate(feature)) {
                    if (!bounds) {
                        bounds = feature.bounds.clone();
                    } else {
                        bounds.include(feature.bounds);
                    }
                }
            });
            
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
        var _schema = this.schema._schema;
        
        var cursor = new Cursor({
            open: function() {
                var query = new DefaultQuery(this.name, filter._filter);
                return this._source.dataStore.getFeatureReader(query, Transaction.AUTO_COMMIT);
            },
            cast: function(_feature) {
                var feature = Feature.from_(_feature, _schema);
                feature.layer = this;
                return feature;
            },
            scope: this
        });
        
        return cursor;
    },
    
    /** api: property[features]
     *  :class:`cursor.Cursor`
     *  A cursor object for accessing all features on the layer.
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
            if (feature.layer) {
                feature = feature.clone();
            }
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
        feature.layer = this;
    },
    
    /** api: method[remove]
     *  :arg filter: :class:`filter.Filter` or ``String`` or 
     *      :class:`feature.Feature`
     *
     *  Remove features from a layer that match the given filter or CQL string.
     *  Alternatively, a feature can be provided to remove a single feature from
     *  the layer.
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
            throw new Error("Call remove with a filter or a feature.");
        }
        if (filter instanceof Feature) {
            filter = new FILTER.fids([filter.id]);
        } else if (!(filter instanceof FILTER.Filter)) {
            filter = new FILTER.Filter(filter);
        }
        this._source.removeFeatures(filter._filter);
    },

    /** private: method[queueModified]
     *  :arg feature: :class:`feature.Feature` The modified feature.
     *  :arg name: ``String`` The modified field name.
     */
    queueModified: function(feature, name) {
        if (!this.cache.modifiedFeatures) {
            this.cache.modifiedFeatures = {};
        }
        var modified = this.cache.modifiedFeatures;
        var id = feature.id;
        if (!(id in modified)) {
            modified[id] = {names: {}};
        }
        modified[id].feature = feature;
        modified[id].names[name] = true;
    },

    /** api: method[update]
     *  Update any features that have been modified since the last update.  This
     *  persists feature changes.
     */
    update: function() {
        var modified = this.cache.modifiedFeatures;
        if (modified) {
            var _filter = FilterFactory2.createFidFilter();
            for (var id in modified) {
                _filter.addFid(id);
            }
            var results = this._source.dataStore.getFeatureWriter(this.name, _filter, Transaction.AUTO_COMMIT);
            try {
                while (results.hasNext()) {
                    var _feature = results.next();
                    id = _feature.getIdentifier();
                    var names = modified[id].names;
                    for (var name in names) {
                        // modify clean feature with dirty attributes
                        _feature.setAttribute(
                            name, 
                            modified[id].feature._feature.getAttribute(name)
                        );
                    }
                    results.write();
                    delete modified[id];
                }
            } finally {
                results.close();
            }
            delete this.cache.modifiedFeatures;
        }
    },

    /** private: property[config]
     */
    get config() {
        var config = {
            type: "Layer",
            name: this.name
        };
        if (this.temporary) {
            config.schema = this.schema.config;
        } else {
            config.workspace = this.workspace.config;
        }
        return config;
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this layer.  This representation does not
     *  include members for each feature in the layer.
     */
    
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
};

/** api: example
 *  Sample code to create a temporary layer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var layer = new LAYER.Layer({name: "temp"});
 *
 *      js> var layer = new LAYER.Layer({
 *        >     name: "temp",
 *        >     fields: [{name: "geom", type: "Geometry"}]
 *        > });
 *
 *      js> var FEATURE = require("geoscript/feature");
 *      js> var schema = new FEATURE.Schema({
 *        >     name: "temp",
 *        >     fields: [{name: "geom", type: "Geometry"}]
 *        > });
 *      js> var layer = new LAYER.Layer({schema: schema});
 */

exports.Layer = Layer;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`layer.Layer`
 *
 *  Create a layer given a configuration object.
 */
var registry = new Registry();
exports.create = registry.create;

// register a layer factory for the module
registry.register(new Factory(Layer, {
    handles: function(config) {
        return true;
    }
}));
