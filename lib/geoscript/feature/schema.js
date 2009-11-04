var proj = require("geoscript/proj");
var geom = require("geoscript/geom");
var util = require("geoscript/util");
var nutil = require("util");
var jts = Packages.com.vividsolutions.jts;
var geotools = Packages.org.geotools;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var NameImpl = geotools.feature.NameImpl;

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
        throw new Error("Can't get name for field type: " + type);
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
            throw new Error("Can't resolve field type name: " + name);
        } else {
            throw new Error("Unsupported field type: " + value);
        }
    }
    return type;
};

var Schema = util.extend(Object, {
    
    constructor: function Schema(config) {        
        if (config) {
            if (!config.fields || !config.fields.forEach) {
                throw new Error("Construct schema with a fields array.");
            }
            // generate gt feature type from field definitions
            var builder = new SimpleFeatureTypeBuilder();
            builder.setName(new NameImpl(config.name || "feature"));
            config.fields.forEach(function(field) {
                var name = field[0];
                var typeName = field[1];
                if (geom[typeName]) {
                    if (field.length > 2) {
                        var p = field[2];
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
        
        // fields property
        this.fields = descriptors.map(function(ad) {
            return [ad.getLocalName(), getTypeName(ad.type.getBinding())];
        });
    
        // fieldNames property
        this.fieldNames = descriptors.map(function(ad) {
            return ad.getLocalName();
        });

    },

    toFullString: function() {
        return nutil.repr(this.fields);
    }

});

Schema.from_ = function(_schema) {
    var schema = new Schema();
    schema._schema = _schema;
    schema.init();
    return schema;
};

Schema.fromValues = function(values) {
    var value, field, fields = [];
    for (var name in values) {
        value = values[name];
        field = [name, getType(value)];
        if (value instanceof geom.Geometry && value.projection) {
            field[2] = value.projection;
        }
        fields.push(field);
    }
    return new Schema({fields: fields});
};

exports.Schema = Schema;
