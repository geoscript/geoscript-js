var geom = require("geoscript/geom");
var jts = Packages.com.vividsolutions.jts;
var SimpleFeatureBuilder = Packages.org.geotools.feature.simple.SimpleFeatureBuilder;
var util = require("geoscript/util");
var nutil = require("util");
var Schema = require("geoscript/feature/schema").Schema;

var Feature = util.extend(Object, {
    
    geometry: null,
    
    constructor: function Feature(config) {
        if (config) {
            if (config.schema) {
                this.schema = config.schema;                
            } else {
                this.schema = Schema.fromValues(config.values);
            }

            var builder = new SimpleFeatureBuilder(this.schema._schema);
            var value;
            for (var name in config.values) {
                value = config.values[name];
                if (value instanceof geom.Geometry) {
                    value = value._geometry;
                }
                builder.set(name, value);
            }
            this._feature = builder.buildFeature(config.id); 

            this.init();
        }
    },
    
    /** private: method[init]
     *  Called after feature has _feature and schema properties.
     */ 
    init: function() {
        this.id = this._feature.identifier.toString();
    },
    
    getGeometry: function() {
        if (this.geometry === null) {
            var _geometry = this._feature.defaultGeometry;
            if (_geometry) {
                this.geometry = geom.Geometry.from_(_geometry); // may be undefined
            }
        }
        return this.geometry;
    },
    
    setGeometry: function(geometry) {
        this._feature.defaultGeometry = geometry._geometry;
        this.geometry = null; // clear cache
    },
    
    set: function(name, value) {
        if (value instanceof geom.Geometry) {
            value = value._geometry;
            this.geometry = null; // clear the cache
        }
        this._feature.setAttribute(name, value);
    },
    
    get: function(name) {
        var value = this._feature.getAttribute(name);
        if (value instanceof jts.geom.Geometry) {
            value = geom.Geometry.from_(value);
        }
        return value;
    },
    
    getValues: function() {
        var values = {};
        this.schema.fieldNames.forEach(function(name) {
            values[name] = this.get(name);
        }, this);
        return values;
    },

    toFullString: function() {
        var values = this.getValues();
        for (var name in values) {
            if (values[name] instanceof geom.Geometry) {
                values[name] = values[name].toString();
            }
        }
        return nutil.repr(values);
    }
    
});

Feature.from_ = function(_feature, _schema) {
    var feature = new Feature();
    feature._feature = _feature;
    feature.schema = Schema.from_(_schema || _feature.type);
    feature.init();
    return feature;
};

exports.Feature = Feature;
