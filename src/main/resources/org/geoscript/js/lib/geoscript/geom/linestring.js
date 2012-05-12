var Geometry = require("./geometry").Geometry;
var Factory = require("../factory").Factory;
var UTIL = require("../util");
var GEOM_UTIL = require("./util");

var _arrayToCoord = GEOM_UTIL._arrayToCoord;
var _coordToArray = GEOM_UTIL._coordToArray;
var _getMethod = GEOM_UTIL._getMethod;

/** api: (geom.LineString) */

/** api: (define)
 *  module = geom
 *  class = LineString
 */

/** api: (extends)
 *  geom/geometry.js
 */
var LineString = UTIL.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: LineString
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new linestring.
     */
    constructor: function LineString(coords) {
        Geometry.prototype.constructor.apply(this, [coords]);
    },
    
    /** api: property[endPoint]
     *  :class`geom.Point`
     *  The last point in the linestring.
     */
    get endPoint() {
        return Geometry.from_(this._geometry.getEndPoint());
    },
    
    /** api: property[startPoint]
     *  :class`geom.Point`
     *  The first point in the linestring.
     */
    get startPoint() {
        return Geometry.from_(this._geometry.getStartPoint());
    },

    /** api: property[endPoints]
     *  ``Array``
     *  List of start point and end point.
     */
    get endPoints() {
        return [this.startPoint, this.endPoint];
    },

    /** api: method[reverse]
     *  :returns: :class`geom.LineString`
     *
     *  Create a new linestring whose coordinates are in the reverse order of
     *  this linestring.
     */
    reverse: function() {
        return Geometry.from_(this._geometry.reverse());
    },

    /** private: method[_create]
     *  :arg coords: ``Array`` A coordinates array.
     *
     *  Create a JTS geometry from an array of coordinates.
     */
    _create: function(coords) {
        var _coords = new Array(coords.length);
        coords.forEach(function(c, i) {
            _coords[i] = _arrayToCoord(c);
        });
        return Geometry._factory.createLineString(_coords);
    },

    /** private: method[extractCoordinates]
     *  :arg _geometry: ``com.vividsolutions.jts.geom.Geometry``
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function(_geometry) {
        var _coords = _getMethod(_geometry, "getCoordinates")();
        return _coords.map(_coordToArray);
    }
    
});


/** api: example
 *  Sample code to new linestring:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var line = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      js> line.coordinates.length
 *      3
 *      js> line.length
 *      402.49223594996215
 */

exports.LineString = LineString;

// register a linestring factory for the module
GEOM_UTIL.register(new Factory(LineString, {
    handles: function(config) {
        config = GEOM_UTIL._prepConfig(config);
        var capable = false;
        if (config.coordinates && UTIL.isArray(config.coordinates)) {
            for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
                var p = config.coordinates[i];
                if (UTIL.isArray(p)) {
                    var len = p.length;
                    if (len === 2 || len === 3) {
                        capable = true;
                        for (var j=0; j<len; ++j) {
                            capable = capable && (typeof p[j] === "number");
                        }
                    }
                }
            }
        }
        return capable;
    }
}));
