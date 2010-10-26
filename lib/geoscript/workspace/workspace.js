var UTIL = require("../util");
var Schema = require("../feature").Schema;

/** api: (define)
 *  module = workspace
 *  class = Workspace
 */
var Workspace = UTIL.extend(Object, {
    
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
     *  :arg name: ``String`` Optional name for the new layer.
     *  :returns: :class:`layer.Layer`
     *
     *  Create a new layer in this workspace with the features from an existing
     *  layer.  If a layer with the same name already exists in this workspace,
     *  you must provide a new name for the layer.
     */
    add: function(layer, name, type) {
        name = name || layer.name;
        if (this.get(name)) {
            throw "A layer named '" + layer.name + "' already exists in the workspace.";
        }
        var features = layer.features;
        var schema = new Schema({
            name: name,
            fields: layer.schema.fields
        });
        layer._source = this._createSource(schema._schema, type);
        layer.workspace = this;
        layer.cache = {};
        features.forEach(layer.add, layer);
        return layer;
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
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this workspace.
     */
    get json() {
        return JSON.stringify(this.config);
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

exports.Workspace = Workspace;
