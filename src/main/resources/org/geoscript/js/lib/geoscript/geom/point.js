var Geometry = require("./geometry").Geometry;
var Factory = require("../factory").Factory;
var UTIL = require("../util");
var GEOM_UTIL = require("./util");

var _arrayToCoord = GEOM_UTIL._arrayToCoord;
var _coordToArray = GEOM_UTIL._coordToArray;
var _getMethod = GEOM_UTIL._getMethod;


/** api: (geom.Point) */

/** api: (define)
 *  module = geom
 *  class = Point
 */

/** api: (extends)
 *  geom/geometry.js
 */
var Point = UTIL.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: Point
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new point.
     */
    constructor: function Point(coords) {
        Geometry.prototype.constructor.apply(this, [coords]);
        Object.defineProperty(this, "0", {
            get: function() {
                return this.x;
            }
        });
        Object.defineProperty(this, "1", {
            get: function() {
                return this.y;
            }
        });
        Object.defineProperty(this, "2", {
            get: function() {
                return this.z;
            }
        });
    },

    /** private: method[_create]
     *  :arg _coords: ``jts.geom.Coordinates``
     *
     *  Create a JTS geometry from JTS coordinates.
     */
    _create: function(coords) {
        return Geometry._factory.createPoint(_arrayToCoord(coords));
    },
    
    /** private: method[extractCoordinates]
     *  :arg _geometry: ``com.vividsolutions.jts.geom.Geometry``
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function(_geometry) {
        var _coords = _getMethod(_geometry, "getCoordinates")();
        return _coordToArray(_coords[0]);
    },

    /** api: property[x]
     *  ``Number`` 
     *  The first coordinate value.
     */
    get x() {
        return _getMethod(this._geometry, "getX")();        
    },

    /** api: property[y]
     *  ``Number`` 
     *  The second coordinate value.
     */
    get y() {
        return _getMethod(this._geometry, "getY")();
    },

    /** api: property[z]
     *  ``Number`` 
     *  The third coordinate value (or NaN if none).
     */
    get z() {
        return _getMethod(this._geometry, "getCoordinate")().z;
    },

    /** private: property[length]
     *  ``Number`` 
     *  The number of coordinates.
     */
    get length() {
        return isNaN(this.z) ? 2 : 3;
    },
    
    /** private: method[slice]
     *  :arg begin: ``Number`` Zero-based index at which to begin extraction.
     *  :arg end: ``Number``  Zero-based index at which to end extraction.
     *  :returns: ``Point`` 
     *
     *  Returns a shallow copy of the point, accepting arguments of the 
     *  Array.prototype.slice method.
     */
    slice: function() {
        return Array.prototype.slice.apply(this, arguments);
    }

});

/** api: example
 *  Sample code to create a new point:
 * 
 *  .. code-block:: javascript
 *
 *      js> var point = new GEOM.Point([-180, 90]);
 *      js> point.x;
 *      -180
 *      js> point.y;
 *      90
 */

exports.Point = Point;

// register a point factory for the module
GEOM_UTIL.register(new Factory(Point, {
    handles: function(config) {
        config = GEOM_UTIL._prepConfig(config);
        var capable = false;
        if (config.coordinates && UTIL.isArray(config.coordinates)) {
            var len = config.coordinates.length;
            if (len == 2 || len == 3) {
                capable = true;
                for (var i=0; i<len; ++i) {
                    capable = capable && (typeof config.coordinates[i] === "number");
                }
            }
        }
        return capable;
    }
}));
