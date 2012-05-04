var Geometry = require("./geometry").Geometry;
var Factory = require("../factory").Factory;
var GEOM_UTIL = require("./util");
var Point = require("./point").Point;
var LineString = require("./linestring").LineString;
var Polygon = require("./polygon").Polygon;
var UTIL = require("../util");

var _getMethod = GEOM_UTIL._getMethod;
var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = GeometryCollection
 */

/** api: (extends)
 *  geom/geometry.js
 */
var GeometryCollection = UTIL.extend(Geometry, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,
    
    /** private: componentDimension
     *  ``Number``
     *  The dimension of component geometries.  If `null`, the collection may
     *  have mixed component types.
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
     *      Create a multipart geometry with mixed geometry types.  The items
     *      in the coords array may be geometry coordinates or :class:`geom.Geometry`
     *      objects.
     */
    constructor: function GeometryCollection(coords) {
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
        var num = _getMethod(this._geometry, "getNumGeometries")();
        var geometries = this.cache.components;
        var dirty = false;
        if (!geometries || geometries.length !== num) {
            geometries = new Array(num);
            dirty = true;
        }
        var geometry;
        for (var i=0; i<num; ++i) {
            geometry = geometries[i];
            if (!(geometry instanceof Geometry)) {
                geometries[i] = Geometry.from_(_getMethod(this._geometry, "getGeometryN")(i));
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
    while (UTIL.isArray(config)) {
        ++dim;
        coords = coords[0];
    }
    return dim;
};

exports.GeometryCollection = GeometryCollection;

// register a collection factory for the module
// register a multipoint factory for the module
GEOM_UTIL.register(new Factory(GeometryCollection));
