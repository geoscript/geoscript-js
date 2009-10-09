var json = require("json");
var geom = require("geoscript/geom");
var proj = require("geoscript/proj");
var geotools = Packages.org.geotools;
var jts = Packages.com.vividsolutions.jts;
var GeometryDescriptor = Packages.org.opengis.feature.type.GeometryDescriptor;
var SimpleFeatureBuilder = geotools.feature.simple.SimpleFeatureBuilder;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var crs = geotools.referencing.CRS;
var NameImpl = geotools.feature.NameImpl;
var CoordinateReferenceSystem = Packages.org.opengis.referencing.crs.CoordinateReferenceSystem;

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

var Schema = function(config) {
    config = config || {};
    config.name = config.name || "feature";
    this._ft = config.ft;
    if (config.atts) {
        // generate gt feature type from attributes
        var builder = new SimpleFeatureTypeBuilder();
        builder.setName(new NameImpl(config.name));
        config.atts.forEach(function(att) {
            var name = att[0],
                typeName = att[1];
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
        this._ft = builder.buildFeatureType();
    }
    this.name = this._ft.name.localPart;

    // geom property
    var gd = this._ft.geometryDescriptor;
    if (gd) {
        this.geom = [
            gd.localName,
            getTypeName(gd.type.binding)
        ];
        if (gd.coordinateReferenceSystem) {
            this.geom[2] = new proj.Projection(gd.coordinateReferenceSystem);
        }
    }
    
    // atts property
    this.atts = this._ft.attributeDescriptors.toArray().map(function(ad) {
        return [ad.localName, getTypeName(ad.type.binding)];
    });
    
    // attNames property
    this.attNames = this._ft.attributeDescriptors.toArray().map(function(ad) {
        return ad.localName;
    });

};

Schema.prototype = {
    feature: function(atts, id) {
        return new Feature({
            schema: this,
            atts: atts,
            id: id
        });
    }
};

Schema.fromGT = function(ft) {
    return new Schema({ft: ft});
};

Schema.fromAtts = function(atts) {
    var value, def, defs = [];
    for (var name in atts) {
        value = atts[name];
        def = [name, getType(value)];
        if (value instanceof geom.Geometry && value.crs) {
            def[2] = value.crs;
        }
        defs.push(def);
    }
    return new Schema({atts: defs});    
};

var Feature = function(config) {
    config = config || {};
    this.schema = config.schema;
    
    if (config.atts) {
        if (!this.schema) {
            // generate feature type from attributes
            this.schema = Schema.fromAtts(config.atts);
        }
        
        var builder = new SimpleFeatureBuilder(this.schema._ft);
        var value;
        for (var name in config.atts) {
            value = config.atts[name];
            if (value instanceof geom.Geometry) {
                value = value._geometry;
            }
            builder.set(name, value);
        }
        this._feature = builder.buildFeature(config.id); 
        
    } else if (config.f) {
        this._feature = config.f;
        if (!this.schema) {
            this.schema = Schema.fromGT(this._feature.type);
        }
    } else {
        throw new Error("No attributes specified.");
    }
    
    this.id = this._feature.identifier.toString();

    // geometry setter/getter with cache
    var none = {};
    var cache = none;
    this.geom = function(g) {
        if (g && g instanceof geom.Geometry) {
            // set
            this._feature.defaultGeometry = g._geometry;
            cache = none;
        } else {
            // get
            if (cache !== none) {
                g = cache;
            } else {
                var jg = this._feature.defaultGeometry;
                if (jg) {
                    g = geom.Geometry.fromJTS(jg);
                }
                cache = g; // may be undefined
            }
        }
        return g;
    };
    
};

Feature.fromGT = function(feature) {
    return new Feature({f: feature});
};

Feature.prototype = {
    
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
            value = geom.Geometry.fromJTS(value);
        }
        return value;
    },
    
    atts: function() {
        var atts = {};
        this.schema.attNames.forEach(function(name) {
            atts[name] = this.get(name);
        }, this);
        return atts;
    }
        
};

exports.Schema = Schema;
exports.Feature = Feature;
