/** api: module = feature */

/** api: synopsis
 *  Feature related functionality.
 */

/** api: summary
 *  The :mod:`feature` module provides a provides constructors for features
 *  and feature schema.
 *
 *  .. code-block:: javascript
 *  
 *      js> var FEATURE = require("geoscript/feature");
 */

var Geometry = require("./geom").Geometry; // needs to be initialized first
// define all feature classes
Packages.org.geoscript.js.feature.Module.init(this);

/** api: classes[] = feature */
var Feature = exports.Feature = this["org.geoscript.js.feature.Feature"];

Feature.prototype.clone = function(config) {
    config = config || {};

    var schema;
    if (config.schema) {
        if (config.schema instanceof Schema) {
            schema = config.schema;
        } else {
            schema = new Schema(config.schema);
        }
    } else {
        schema = this.schema.clone();
    }

    var properties = {};
    var names = schema.fieldNames;
    if (config.properties) {
        for (var name in config.properties) {
            if (names.indexOf(name) > -1) {
                properties[name] = config.properties[name];
            }
        }
    }
    for (var name in this.properties) {
        if (!(name in properties) && names.indexOf(name) > -1) {
            properties[name] = this.get(name);
        }
    }

    var feature = new Feature({
        schema: schema,
        properties: properties
    });

    // ensure all geometries are clones
    var value;
    for (var name in feature.properties) {
        value = feature.get(name);
        if (value instanceof Geometry) {
            feature.set(name, value.clone());
        }
    }

    return feature;
};

var FeatureCollection = exports.FeatureCollection = this["org.geoscript.js.feature.FeatureCollection"];

var Field = exports.Field = this["org.geoscript.js.feature.Field"];

var Schema = exports.Schema = this["org.geoscript.js.feature.Schema"];

Schema.prototype.clone = function(config) {
    var fields = [];
    var configFields = config && config.fields || [];
    var configField, added, existing = {};
    // replace any existing fields with provided fields
    this.fields.forEach(function(field) {
        existing[field.name] = true;
        added = false;
        for (var i=0, ii=configFields.length; i<ii; ++i) {
            configField = configFields[i];
            if (field.name === configField.name) {
                fields.push(configField);
                added = true;
                break;
            }
        }
        if (!added) {
            fields.push(field);
        }
    });
    // add any new fields
    configFields.forEach(function(field) {
        if (!(field.name in existing)) {
            fields.push(field);
        }
    });

    return new Schema({
        name: config && config.name || this.name,
        fields: fields
    });
};

Schema.fromValues = function(values) {
    var value, type, config, fields = [];
    for (var name in values) {
        value = values[name];
        type = Field.getTypeName(value);
        if (type === null) {
            throw new Error("No appropriate type found for value: " + value);
        }
        fields.push(new Field({name: name, type: type}));
    }
    return new Schema({fields: fields});
};

