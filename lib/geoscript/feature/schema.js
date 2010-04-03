var register = require("./util").register;
var Factory = require("../factory").Factory;
var PROJ = require("../proj");
var GEOM = require("../geom");
var UTIL = require("../util");
var NUTIL = require("util");
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
    if (value instanceof GEOM.Geometry) {
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

var prepConfig = function(config) {
    if (config instanceof Array) {
        config = {fields: config};
    } else {
        config = UTIL.apply({}, config);
    }
    return config;
};

/** api: (define)
 *  module = feature
 *  class = Schema
 */
var Schema = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Schema
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a new schema.
     */
    constructor: function Schema(config) {        
        if (config) {
            config = prepConfig(config);
            if (!config.fields || !config.fields.forEach) {
                throw new Error("Construct schema with a fields array.");
            }
            // generate gt feature type from field definitions
            var builder = new SimpleFeatureTypeBuilder();
            builder.setName(new NameImpl(config.name || "feature"));
            config.fields.forEach(function(field) {
                if (GEOM[field.type]) {
                    var p = field.projection;
                    if (p) {
                        if (!(p instanceof PROJ.Projection)) {
                            p = new PROJ.Projection(p);
                        }
                        builder.crs(p._projection);
                    }
                }
                builder.add(field.name, types[field.type]);
            });
            this._schema = builder.buildFeatureType();
        }
    },
    
    /** api: method[clone]
     *  :arg name: ``String`` Name for the cloned schema.  If not provided
     *      a schema with the same name as this one will be created.
     */
    clone: function(name) {
        return new Schema({
            name: name || this.name,
            fields: this.fields
        });
    },
    
    /** api: property[name]
     *  ``String``
     *  The schema name.
     */
    get name() {
        return String(this._schema.getName().getLocalPart());
    },
    
    /** api: property[geometry]
     *  ``Object``
     *  Default geometry field definition.  Will be ``undefined`` if the schema
     *  doesn't include a geometry field.
     */
    get geometry() {
        var field;
        var descriptor = this._schema.getGeometryDescriptor();
        if (descriptor) {
            field = {
                name: String(descriptor.getLocalName()),
                type: getTypeName(descriptor.type.getBinding())                
            };
            var _projection = descriptor.getCoordinateReferenceSystem();
            if (_projection) {
                field.projection = PROJ.Projection.from_(_projection);
            }
        }
        return field;
    },
    
    /** api: property[fields]
     *  ``Array``
     *  Array of field definitions.  Field definitions are objects with at
     *  least ``name`` and ``type`` properties.  Geometry field definitions
     *  may have a ``projection`` property.
     */
    get fields() {
        var descriptors = this._schema.getAttributeDescriptors().toArray();
        return descriptors.map(function(ad) {
            var field = {
                name: String(ad.getLocalName()), 
                type: getTypeName(ad.type.getBinding())
            };
            if (GEOM[field.type]) {
                var _projection = ad.getCoordinateReferenceSystem();
                if (_projection) {
                    field.projection = PROJ.Projection.from_(_projection);
                }
            }
            return field;
        });
    },
    
    /** api: method[get]
     *  :arg name: ``String`` A field name.
     *  :returns:  ``Object`` A field definition.
     *
     *  Get the definition for a named field.  Field definitions have at least
     *  ``name`` and ``type`` properties.  Geometry field definitions may have
     *  a ``projection`` property.  Returns ``undefined`` if no field is found
     *  with the given name.
     */
    get: function(name) {
        var fields = this.fields;
        var field;
        for (var i=0, len=fields.length; i<len; ++i) {
            if (fields[i].name === name) {
                field = fields[i];
                break;
            }
        }
        return field;
    },
    
    /** api: property[fieldNames]
     *  ``Array``
     *  Array of field names.
     */
    get fieldNames() {
        var descriptors = this._schema.getAttributeDescriptors().toArray();
        return descriptors.map(function(ad) {
            return String(ad.getLocalName());
        });
    },
    
    /** private: property[config]
     */
    get config() {
        return {
            type: "Schema",
            name: this.name,
            fields: this.fields
        }
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this schema.
     */
    get json() {
        return JSON.encode(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        var fields = this.fields.map(function(field) {
            var f = {};
            for (var key in field) {
                f[key] = String(field[key]);
            }
            return f;
        });
        return "name: \"" + this.name + "\", fields: " + NUTIL.repr(fields);
    }

});

Schema.from_ = function(_schema) {
    var schema = new Schema();
    schema._schema = _schema;
    return schema;
};

Schema.fromValues = function(values) {
    var value, field, fields = [];
    for (var name in values) {
        value = values[name];
        field = {
            name: name, 
            type: getTypeName(getType(value))
        };
        if (value instanceof GEOM.Geometry && value.projection) {
            field.projection = value.projection;
        }
        fields.push(field);
    }
    return new Schema({fields: fields});
};

/** api: example
 *  Sample code to create a new schema:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var cities = new FEATURE.Schema({
 *        >     name: "cities",
 *        >     fields: [{
 *        >         name: "the_geom",
 *        >         type: "Point",
 *        >         projection: "EPSG:4326"
 *        >     }, {
 *        >         name: "name",
 *        >         type: "String"
 *        >     }]  
 *        > });
 *        js> cities.fields.length
 *        2
 *        js> cities.geometry.name
 *        the_geom
 *        js> cities.get("the_geom").type
 *        Point
 *        js> cities.get("the_geom").projection
 *        <Projection EPSG:4326>
 */

exports.Schema = Schema;

// register a schema factory for the module
register(new Factory(Schema, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.fields instanceof Array);
    }
}));
