var Geometry = require("geoscript/geom/geometry").Geometry;
var Point = require("geoscript/geom/point").Point;
var LineString = require("geoscript/geom/linestring").LineString;
var Polygon = require("geoscript/geom/polygon").Polygon;
var util = require("geoscript/util");
var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = GeometryCollection
 */

/** api: (extends)
 *  geom/geometry.js
 */
var GeometryCollection = util.extend(Geometry, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,
    
    /** private: componentDimension
     *  ``Number``
     *  The dimension of component geometries.  The collection may have midex
     *  component types.
     */
    componentDimension: null,
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: jts.geom.GeometryCollection,
    
    /** api: constructor
     *  .. class:: GeometryCollection
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      A collection should not be created directly.  Use one of the 
     *      collection subclasses instead.
     */
    constructor: function GeometryCollection(coords) {
        this.cache = {};
        Geometry.prototype.constructor.apply(this, [coords]);
    },
    
    /** private: method[_create]
     *  :arg coords: ``Array`` Array of geometry coordinates.
     */
    _create: function(coords) {
        var item, geometry, components = [], _components = [], coordinates = [];
        var constructors = [Point, LineString, Polygon];
        for (var i=0, len=coords.length; i<len; ++i) {
            item = coords[i];
            if (item instanceof Geometry) {
                geometry = item;
            } else {
                var Type;
                if (this.componentDimension !== null) {
                    Type = constructors[this.componentDimension];
                } else {
                    Type = constructors[getDimension(item)];
                }
                geometry = new Type(item);
            }
            components[i] = geometry;
            coordinates[i] = geometry.coordinates;
            _components[i] = geometry._geometry;
        }
        this.cache.components = components;
        return new this._Type(_components, Geometry._factory);
    },
    
    /** api: property[components]
     *  ``Array`` 
     *  The component :class:`geom.Geometry` objects that make up this collection.
     */
    get components() {
        var num = this._geometry.getNumGeometries();
        var geometries = this.cache.components || [];
        var dirty = false;
        if (geometries.length !== num) {
            geometries = new Array(num);
            dirty = true;
        }
        var geometry;
        for (var i=0; i<num; ++i) {
            geometry = geometries[i];
            if (!(geometry instanceof Geometry)) {
                geometries[i] = Geometry.from_(this._geometry.getGeometryN(i));
                dirty = true;
            }
        }
        if (dirty) {
            this.cache.components = geometries;
        }
        return this.cache.components.slice();
    },
    
    /** api: property[coordinates]
     *  :returns: ``Array`` An array of coordinates.
     *
     *  An array of coordinates for the geometry.
     */
    get coordinates() {
        return this.components.map(function(geometry) {
            return geometry.coordinates;
        });
    }

});

/**
 * Quickly extract the geometry dimension given a coordinates array.
 * Only works with well behaved coordinates.
 */
var getDimension = function(coords) {    
    var dim = -1;
    while (coords instanceof Array) {
        ++dim;
        coords = coords[0];
    }
    return dim;
};

exports.GeometryCollection = GeometryCollection;
