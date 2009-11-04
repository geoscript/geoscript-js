var geom = require("geoscript/geom");
var jts = Packages.com.vividsolutions.jts;
var SimpleFeatureBuilder = Packages.org.geotools.feature.simple.SimpleFeatureBuilder;
var util = require("geoscript/util");
var nutil = require("util");
var Schema = require("geoscript/feature/schema").Schema;

/** api: (define)
 *  module = feature
 *  class = Feature
 */
var Feature = util.extend(Object, {
    
    /** private: property[geometry]
     *  :class:`geom.Geometry`
     *  Cached geometry.
     */ 
    geometry: null,
    
    /** api: property[schema]
     *  :class:`feature.Schema`
     *  The feature schema.
     */
    schema: null,
    
    /** api: property[id]
     *  ``String``
     *  The feature identifier.
     */
    id: null,
    
    /** api: constructor
     *  .. class:: Feature
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a new feature.
     */
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
    
    /** api: method[getGeometry]
     *  :returns: :class:`geom.Geometry`
     *
     *  Get the default geometry (if any) for the feature.  Returns 
     *  ``undefined`` if the feature does not have a geometry.
     */
    getGeometry: function() {
        if (this.geometry === null) {
            var _geometry = this._feature.defaultGeometry;
            if (_geometry) {
                this.geometry = geom.Geometry.from_(_geometry); // may be undefined
            }
        }
        return this.geometry;
    },
    
    /** api: method[setGeometry]
     *  :arg geometry: :class:`geom.Geometry`
     *
     *  Set the default geometry or the feature.
     */
    setGeometry: function(geometry) {
        this._feature.defaultGeometry = geometry._geometry;
        this.geometry = null; // clear cache
    },
    
    /** api: method[set]
     *  :arg name: ``String`` Attribute name.
     *  :arg value: ``String`` Attribute value.
     *
     *  Set a feature attribute.
     */
    set: function(name, value) {
        if (value instanceof geom.Geometry) {
            value = value._geometry;
            this.geometry = null; // clear the cache
        }
        this._feature.setAttribute(name, value);
    },
    
    /** api: method[get]
     *  :arg name: ``String`` Attribute name.
     *
     *  Get an attribute value.
     */
    get: function(name) {
        var value = this._feature.getAttribute(name);
        if (value instanceof jts.geom.Geometry) {
            value = geom.Geometry.from_(value);
        }
        return value;
    },
    
    /** api: method[getValues]
     *  :returns: ``Object``
     *
     *  Get a values object with property names and values.
     */
    getValues: function() {
        var values = {};
        this.schema.fieldNames.forEach(function(name) {
            values[name] = this.get(name);
        }, this);
        return values;
    },

    /** private: method[toFullString]
     */
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

/** private: staticmethod[from_]
 *  :arg _feature: ``org.geotools.feature.simple.SimpleFeatureImpl``
 *  :arg _schema: ``org.geotools.feature.simple.SimpleFeatureTypeImpl`` Optional schema.
 *  :returns: :class:`Feature`
 *
 *  Create a feature from corresponding GeoTools parts.
 */
Feature.from_ = function(_feature, _schema) {
    var feature = new Feature();
    feature._feature = _feature;
    feature.schema = Schema.from_(_schema || _feature.type);
    feature.init();
    return feature;
};

/** api: example
 *  Sample code to create a new feature:
 * 
 *  .. code-block:: javascript
 * 
 *      var city = new feature.Feature({
 *          values: {
 *              location: new geom.Point([-110, 45]),
 *              name: "Metropolis"
 *          }
 *      });
 *      city.get("name"); // "Metropolis"
 *      city.get("location"); // <Point POINT (-110 45)>
 */

exports.Feature = Feature;
