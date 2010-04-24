var UTIL = require("../util");
var PROJ = require("../proj");
var GEOM = require("../geom");

var jts = Packages.com.vividsolutions.jts;
var AttributeTypeBuilder = Packages.org.geotools.feature.AttributeTypeBuilder;
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

/** api: (define)
 *  module = feature
 *  class = Field
 */
var Field = UTIL.extend(Object, {

    /** api: constructor
     *  .. class:: Field
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a new field.
     */
    constructor: function Field(config) {
        if (config) {
            if (!config.name) {
                throw new Error("Field config must include 'name' property.");
            }
            if (!config.type) {
                throw new Error("Field config must include 'type' property.");
            }
            if (!types[config.type]) {
                throw new Error("Unsupported field type: " + config.type);
            }
            var builder = new AttributeTypeBuilder();
            builder.setName(config.type);
            builder.setBinding(types[config.type]);
            var projection = config.projection;
            if (projection) {
                if (!(projection instanceof PROJ.Projection)) {
                    projection = new PROJ.Projection(projection);
                }
                builder.setCRS(projection._projection);
            }
            builder.setMinOccurs(config.minOccurs || 0);
            builder.setMaxOccurs(config.maxOccurs || 1);
            if ("isNillable" in config) {
                builder.setNillable(!!config.isNillable);
            }
            if ("defaultValue" in config) {
                // TODO: pass java values
                builder.setDefaultValue(config.defaultValue);
            }
            this._field = builder.buildDescriptor(config.name);
        }
    },
    
    /** api: property[name]
     *  ``String``
     *  The field name.
     */
    get name() {
        return String(this._field.getLocalName());
    },
    
    /** api: property[type]
     *  ``String``
     *  The field type.
     */
    get type() {
        return getTypeName(this._field.getType().getBinding());
    },
    
    /** api: property[minOccurs]
     *  ``Number``
     *  The minimum occurences for field values.  Default is ``0``.
     */
    get minOccurs() {
        return Number(this._field.getMinOccurs());
    },
    
    /** api: property[maxOccurs]
     *  ``Number``
     *  The maximum occurences for field values.  Default is ``1``.
     */
    get maxOccurs() {
        return Number(this._field.getMaxOccurs());
    },
    
    /** api: property[isNillable]
     *  ``Boolean``
     *  The field is nillable.
     */
    get isNillable() {
        return Boolean(this._field.getIsNillable());
    },
    
    get defaultValue() {
        return this._field.getDefaultValue();
    },
    
    /** api: property[projection]
     *  :class:`proj.Projection`
     *  Geometry type fields can have an optional projection.
     */
    get projection() {
        var projection;
        if (GEOM[this.type]) {
            var _projection = this._field.getCoordinateReferenceSystem();
            if (_projection) {
                projection = PROJ.Projection.from_(_projection);
            }
        }
        return projection;
    },
    
    /** api: method[equals]
     *  :arg field: :class:`Field`
     *  :returns: ``Boolean`` The two fields are equivalent.
     *
     *  Determine if another field is equivalent to this one.
     */
    equals: function(field) {
        return Boolean(this._field.equals(field._field));
    },

    /** api: property[json]
     *  ``String``
     *  The JSON representation of the field.
     */
    get json() {
        return JSON.encode(this.config);
    },
    
    /** private: property[config]
     *  ``Object``
     */
    get config() {
        var def = {
            name: this.name,
            type: this.type            
        };
        if (this.projection) {
            // TODO: fall back to wkt?
            def.projection = this.projection.id;
        }
        return {
            type: "Field",
            def: def
        };
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "name: \"" + this.name + "\", type: " + this.type;
    }

});

/** private: staticmethod[fromValue]
 *  :arg name: ``String``
 *  :arg value: ``Object``
 *  :returns: :class:`Field`
 *
 *  Create a field given a name and value.
 */
Field.fromValue = function(name, value) {
    var config = {
        name: name, 
        type: getTypeName(getType(value))
    };
    if (value instanceof GEOM.Geometry && value.projection) {
        config.projection = value.projection;
    }
    return new Field(config);
};

Field.from_ = function(_field) {
    var field = new Field();
    field._field = _field;
    return field;
};

/** api: example
 *  Sample code to create a new field:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var field = new FEATURE.Field({
 *        >     name: "age",
 *        >     type: "Double"
 *        > });
 *
 *      js> var field = new FEATURE.Field({
 *        >     name: "location",
 *        >     type: "Point",
 *        >     projection: "EPSG:4326"
 *        > });
 */
exports.Field = Field;
