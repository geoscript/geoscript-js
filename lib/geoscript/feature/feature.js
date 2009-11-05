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
    
    /** private: property[cache]
     *  ``Object``
     *  Cache for setters & getters.
     */ 
    cache: null,
    
    /** private: property[geometryName]
     *  ``String``
     *  Name for the default geometry property.
     */
    geometryName: null,
    
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
        this.cache = {};
        if (config) {
            if (config.schema) {
                this.schema = config.schema;                
            } else {
                this.schema = Schema.fromValues(config.values);
            }

            var builder = new SimpleFeatureBuilder(this.schema._schema);
            var value, defaultGeom;
            for (var name in config.values) {
                value = config.values[name];
                if (value instanceof geom.Geometry) {
                    if (!defaultGeom) {
                        // TODO: confirm default geom is always first one set
                        defaultGeom = value;
                    }
                    value = value._geometry;
                }
                builder.set(name, value);
            }
            if (defaultGeom) {
                // cache the default geometry
                this.cache.geometry = defaultGeom;
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
        var geomProp = this._feature.getDefaultGeometryProperty();
        if (geomProp) {
            this.geometryName = String(geomProp.getName());
        }
    },
    
    /** api: property[geometry]
     *  :class:`geom.Geometry`
     *  The default geometry (if any) for the feature.  Will be ``undefined`` 
     *  if the feature does not have a geometry.
     */
    get geometry() {
        if (this.cache.geometry == null) {
            var _geometry = this._feature.getDefaultGeometry();
            if (_geometry) {
                this.cache.geometry = geom.Geometry.from_(_geometry); // may be undefined
            }
        }
        return this.cache.geometry;
    },
    set geometry(geometry) {
        this._feature.setDefaultGeometry(geometry._geometry);
        this.cache.geometry = geometry;            
    },
    
    /** api: method[set]
     *  :arg name: ``String`` Attribute name.
     *  :arg value: ``String`` Attribute value.
     *
     *  Set a feature attribute.
     */
    set: function(name, value) {
        if (value instanceof geom.Geometry) {
            if (name === this.geometryName) {
                this.geometry = value;
            }
            value = value._geometry;
        }
        this._feature.setAttribute(name, value);
    },
    
    /** api: method[get]
     *  :arg name: ``String`` Attribute name.
     *
     *  Get an attribute value.
     */
    get: function(name) {
        var value;
        if (name === this.geometryName) {
            value = this.geometry;
        } else {
            value = this._feature.getAttribute(name);
            if (value instanceof jts.geom.Geometry) {
                value = geom.Geometry.from_(value);
            }
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
        if (this.schema) {
            this.schema.fieldNames.forEach(function(name) {
                values[name] = this.get(name);
            }, this);            
        }
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
