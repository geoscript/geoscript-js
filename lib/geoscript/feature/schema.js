var register = require("./util").register;
var Factory = require("../factory").Factory;
var PROJ = require("../proj");
var GEOM = require("../geom");
var UTIL = require("../util");
var NUTIL = require("util");
var Field = require("./field").Field;

var jts = Packages.com.vividsolutions.jts;
var geotools = Packages.org.geotools;
var SimpleFeatureTypeBuilder = geotools.feature.simple.SimpleFeatureTypeBuilder;
var NameImpl = geotools.feature.NameImpl;

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
                if (!(field instanceof Field)) {
                    field = new Field(field);
                }
                if (GEOM[field.type]) {
                    var projection = field.projection;
                    if (projection) {
                        builder.setCRS(projection._projection);
                    }
                }
                builder.add(field._field);
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
        var _field = this._schema.getGeometryDescriptor();
        if (_field) {
            return Field.from_(_field);
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
        return descriptors.map(function(_field) {
            return Field.from_(_field);
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
            return {
                name: field.name,
                type: field.type
            }
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
    var value, config, fields = [];
    for (var name in values) {
        fields.push(Field.fromValue(name, values[name]));
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
