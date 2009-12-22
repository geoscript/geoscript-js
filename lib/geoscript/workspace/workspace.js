var nutil = require("util");
var util = require("geoscript/util");

/** api: (define)
 *  module = workspace
 *  class = Workspace
 */
var Workspace = util.extend(Object, {
    
    /** api: constructor
     *  .. class:: Workspace
     *
     *      A Workspace instance should not be created directly.  
     *      Create an instance of a Workspace subclass instead.
     */
    constructor: function(config) {
        if (config) {
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
     *  Get a layer by name.
     */ 
    get: function(name) {
        var layer;
        if (this.names.indexOf(name) >= 0) {
            var _source = this._store.getFeatureSource(name);
            var Layer = require("geoscript/layer").Layer;
            layer = Layer.from_(_source, this);
        }
        return layer;
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return nutil.repr(this.names);
    }    
    
});

exports.Workspace = Workspace;
