var json = require("json");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");
var geotools = Packages.org.geotools;
var jts = Packages.com.vividsolutions.jts;
var GeometryDescriptor = Packages.org.opengis.feature.type.GeometryDescriptor;
var SimpleFeatureBuilder = geotools.feature.simple.SimpleFeatureBuilder;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var NameImpl = geotools.feature.NameImpl;
var util = require("geoscript/util");
var nutil = require("util");

var types = {};

// map type names to java types
var javaTypeNames = ["String", "Integer", "Short", "Float", "Long", "Double"];
javaTypeNames.forEach(function(str) {
    var type = java.lang[str];
    types[str] = type;
    types[type] = type;
});
// map type names to jts geometry types
var jtsTypeNames = ["Geometry", "Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"];
jtsTypeNames.forEach(function(str) {
    var type = jts.geom[str];
    types[str] = type;
    types[type] = type;
});

var getTypeName = function(type) {
    var name;
    for (var str in types) {
        if (types[str] === type) {
            name = str;
            break;
        };
    }
    if (!name) {
        throw new Error("Can't get name for attribute type: " + type);
    }
    return name;
};

var getType = function(value) {
    var name;
    // deal with geometries
    if (value instanceof geom.Geometry) {
        name = value._geometry.getGeometryType();
    } else {
        var t = typeof value;
        if (t === "string") {
            name = "String";
        } else if (t === "number") {
            name = "Double";
        }
    }
    var type = types[name];
    if (!type) {
        if (name) {
            throw new Error("Can't resolve attribute type name: " + name);
        } else {
            throw new Error("Unsupported attribute type: " + value);
        }
    }
    return type;
};

var Schema = util.extend(Object, {
    
    constructor: function Schema(config) {        
        if (config) {
            // generate gt feature type from attributes
            var builder = new SimpleFeatureTypeBuilder();
            builder.setName(new NameImpl(config.name || "feature"));
            config.atts.forEach(function(att) {
                var name = att[0];
                var typeName = att[1];
                if (geom[typeName]) {
                    if (att.length > 2) {
                        var p = att[2];
                        if (!(p instanceof proj.Projection)) {
                            p = new proj.Projection(p);
                        }
                        builder.crs(p._projection);
                    }
                }
                builder.add(name, types[typeName]);
            });
            this._schema = builder.buildFeatureType();
            this.init();
        }
    },
    
    init: function() {
        this.name = this._schema.getName().getLocalPart();

        // geom property
        var gd = this._schema.getGeometryDescriptor();
        if (gd) {
            this.geom = [
                gd.getLocalName(),
                getTypeName(gd.type.getBinding())
            ];
            var _projection = gd.getCoordinateReferenceSystem();
            if (_projection) {
                this.geom[2] = proj.Projection.from_(_projection);
            }
        }

        var descriptors = this._schema.getAttributeDescriptors().toArray();
        
        // atts property
        this.atts = descriptors.map(function(ad) {
            return [ad.getLocalName(), getTypeName(ad.type.getBinding())];
        });
    
        // attNames property
        this.attNames = descriptors.map(function(ad) {
            return ad.getLocalName();
        });

    },

    feature: function(atts, id) {
        return new Feature({
            schema: this,
            atts: atts,
            id: id
        });
    },

    toFullString: function() {
        return nutil.repr(this.atts);
    }


});

Schema.from_ = function(_schema) {
    var schema = new Schema();
    schema._schema = _schema;
    schema.init();
    return schema;
};

Schema.fromAtts = function(atts) {
    var value, def, defs = [];
    for (var name in atts) {
        value = atts[name];
        def = [name, getType(value)];
        if (value instanceof geom.Geometry && value.projection) {
            def[2] = value.projection;
        }
        defs.push(def);
    }
    return new Schema({atts: defs});    
};

var Feature = util.extend(Object, {
    
    constructor: function Feature(config) {
        if (config) {
            if (config.schema) {
                this.schema = config.schema;                
            } else {
                this.schema = Schema.fromAtts(config.atts);
            }

            var builder = new SimpleFeatureBuilder(this.schema._schema);
            var value;
            for (var name in config.atts) {
                value = config.atts[name];
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

        // geometry setter/getter with cache
        var empty = {};
        var cache = empty;
        this.geom = function(g) {
            if (g && g instanceof geom.Geometry) {
                // set
                this._feature.defaultGeometry = g._geometry;
                cache = empty;
            } else {
                // get
                if (cache !== empty) {
                    g = cache;
                } else {
                    var _geometry = this._feature.defaultGeometry;
                    if (_geometry) {
                        g = geom.Geometry.from_(_geometry);
                    }
                    cache = g; // may be undefined
                }
            }
            return g;
        };
    
    },
    
    set: function(name, value) {
        if (value instanceof geom.Geometry) {
            value = value._geometry;
            this.geom(this.geom()); // clear the cache
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
    
    atts: function() {
        var atts = {};
        this.schema.attNames.forEach(function(name) {
            atts[name] = this.get(name);
        }, this);
        return atts;
    },

    toFullString: function() {
        var a = this.atts();
        for (var k in a) {
            if (a[k] instanceof geom.Geometry) {
                a[k] = a[k].toString();
            }
        }
        return nutil.repr(a);
    }
    
});

Feature.from_ = function(_feature, _schema) {
    var feature = new Feature();
    feature._feature = _feature;
    feature.schema = Schema.from_(_schema || _feature.type);
    feature.init();
    return feature;
};

exports.Schema = Schema;
exports.Feature = Feature;
