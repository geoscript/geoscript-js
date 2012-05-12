var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;
var WS_UTIL = require("./util");
var Schema = require("../feature/schema").Schema;
var Filter = require("../filter").Filter;
var Projection = require("../proj").Projection;

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Transaction = geotools.data.Transaction;
var DefaultTransaction = geotools.data.DefaultTransaction;

/** api: (define)
 *  module = workspace
 *  class = Workspace
 */
var Workspace = UTIL.extend(GeoObject, {
    
    /** api: constructor
     *  .. class:: Workspace
     *
     *      A Workspace instance should not be created directly.  
     *      Create an instance of a Workspace subclass instead.
     */
    constructor: function Workspace(config) {
        if (config) {
            UTIL.applyIf(this, config);
            this._store = this._create(config);
        }
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.AbstractDataStore?``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        throw new Error("Workspace subclasses must implement _create.");
    },
    
    /** api: property[names]
     *  ``Array``
     *  The available layer names in the workspace.
     */
    get names() {
        var _names = this._store.getTypeNames();
        var len = _names.length;
        var names = new Array(len);
        for (var i=0; i<len; ++i) {
            names[i] = String(_names[i]);
        }
        return names;
    },
    
    /** api: method[get]
     *  :arg name: ``String`` Layer name.
     *  :returns: :class:`layer.Layer`
     *
     *  Get a layer by name.  Returns ``undefined`` if name doesn't correspond
     *  to a layer source in the workspace.
     */ 
    get: function(name) {
        var layer;
        if (this.names.indexOf(name) >= 0) {
            try {
                var _source = this._store.getFeatureSource(name);
            } catch (err) {
                throw new Error("Failed to create layer from source named '" + name + "'.");
            }
            var Layer = require("../layer").Layer;
            layer = Layer.from_(_source, this);
        }
        return layer;
    },

    /** api: property[layers]
     *  ``Array``
     *  The available layers in the workspace.
     */
    get layers() {
        var layers = [];
        this.names.forEach(function(name) {
            try {
                var layer = this.get(name);
                if (layer) {
                    layers.push(layer);
                }
            } catch (err) {
                // pass
            }
        }, this);
        return layers;
    },
    
    /** private: method[_createSource]
     *  :arg _schema:
     *  :returns: ``FeatureSource``
     */
    _createSource: function(_schema, type) {
        this._store.createSchema(_schema);
        return this._store.getFeatureSource(_schema.getName());
    },
    
    /** api: method[add]
     *  :arg layer: :class:`layer.Layer` The layer to be added.
     *  :arg options: ``Object`` Options for adding the layer.
     *
     *  Options:
     *   * `name`: ``String`` Name for the new layer.
     *   * `filter`: :class:`filter.Filter` Filter to apply to features before adding.
     *   * `projection: :class:`proj.Projection` Destination projection for the layer.
     *
     *  :returns: :class:`layer.Layer`
     *
     *  Create a new layer in this workspace with the features from an existing
     *  layer.  If a layer with the same name already exists in this workspace,
     *  you must provide a new name for the layer.
     */
    add: function(layer, options) {
        var Layer = require("../layer").Layer;
        options = options || {};
        
        var filter = options.filter || Filter.PASS;
        if (!(filter instanceof Filter)) {
            filter = new Filter(filter);
        }
        
        var name = options.name || layer.name;
        if (this.get(name)) {
            throw new Error("A layer named '" + name + "' already exists in the workspace.");
        }

        var projection = options.projection;
        if (projection && !(projection instanceof Projection)) {
            projection = new Projection(projection);
        }
        
        // clone the schema, optionally changing geometry projection
        var geomField = layer.schema.geometry;
        var schema = layer.schema.clone({
            name: options.name,
            fields: [{
                name: geomField.name, 
                type: geomField.type, 
                projection: projection || geomField.projection
            }]
        });

        var _source = this._createSource(schema._schema);

        var query = new DefaultQuery(layer.name, filter._filter);
        if (projection) {
            if (layer.projection) {
                query.setCoordinateSystem(layer.projection._projection);
            }
            query.setCoordinateSystemReproject(projection._projection); 
        }

        var reader = layer._source.getDataStore().getFeatureReader(query, Transaction.AUTO_COMMIT);
        var transaction = new DefaultTransaction();
        var writer = _source.getDataStore().getFeatureWriterAppend(schema._schema.getName(), transaction);
        var inFeature, outFeature, geom;
        
        try {
            while (reader.hasNext()) {
                inFeature = reader.next();
                outFeature = writer.next();
                outFeature.setAttributes(inFeature.getAttributes());

                // mask empty geometry or PostGIS will complain
                geom = outFeature.getDefaultGeometry();
                if (geom != null && geom.isEmpty()) {
                    outFeature.setDefaultGeometry(null);
                }

                writer.write();
            }
            transaction.commit();
        } finally {
            // TODO deal with failures closing and before
            transaction.close();
        }

        return Layer.from_(_source, this);
    },
    
    /** private: method[_onFeatureAdd]
     *  :arg feature: :class:`feature.Feature`
     *
     *  Do any specific processing on a feature before it is added to a layer.
     */
    _onFeatureAdd: function(feature) {
        // pass
    },
    
    /** private: property[config]
     */
    get config() {
        return {
            type: this.constructor.name
        };
    },
        
    /** api: method[close]
     *  
     *  Close the workspace.  This discards any existing connection to the 
     *  underlying data store and discards the reference to the store.
     */
    close: function() {
        if (this._store) {
            this._store.dispose();
            delete this._store;
        }
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return '["' + this.names.join('", "') + '"]';
    }    
    
});

/** private: staticmethod[from_]
 *  :arg _store: ``org.geotools.data.DataStore`` A GeoTools store.
 *  :returns: :class`Workspace`
 *
 *  Create a geoscript workspace object from a GeoTools store.
 */
Workspace.from_ = function(_store) {
    var workspace;
    try {
        workspace = WS_UTIL.from_(_store);
    } catch (err) {
        // as a fallback, use a generic workspace and hope for the best
        workspace = new Workspace();
        workspace._store = _store;
    }
    return workspace;
};

exports.Workspace = Workspace;
