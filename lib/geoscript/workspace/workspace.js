var Layer = require("geoscript/layer").Layer;
var geom = require("geoscript/geom");
var feature = require("geoscript/feature");
var nutil = require("util");
var util = require("geoscript/util");

var Workspace = util.extend(Object, {
    
    constructor: function(config) {
        if (config) {
            this._store = this._create(config);
        }
    },
    
    _create: function(config) {
        throw new Error("Workspace subclasses must implement _create.");
    },
    
    get names() {
        var _names = this._store.getTypeNames();
        var len = _names.length;
        var names = new Array(len);
        for (var i=0; i<len; ++i) {
            names[i] = String(_names[i]);
        }
        return names;
    },
    
    get: function(name) {
        var layer;
        if (this.names.indexOf(name) >= 0) {
            var _source = this._store.getFeatureSource(name);
            layer = Layer.from_(_source);
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
