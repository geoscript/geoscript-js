var Geometry = require("geoscript/geom/geometry").Geometry;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
var _coordToArray = require("geoscript/geom/geometry")._coordToArray;
var util = require("geoscript/util");

/** api: (geom.Point) */

/** api: (define)
 *  module = geom
 *  class = Point
 */

/** api: (extends)
 *  geom/geometry.js
 */
var Point = util.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: Point
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new point.
     */
    constructor: function Point(coords) {
        Geometry.prototype.constructor.apply(this, [coords]);
    },

    /** api: property[x]
     *  ``Number`` 
     *  The first coordinate value.
     */
    get x() {
        return this._geometry.getX();        
    },

    /** api: property[y]
     *  ``Number`` 
     *  The second coordinate value.
     */
    get y() {
        return this._geometry.getY();
    },

    /** api: property[z]
     *  ``Number`` 
     *  The third coordinate value (or NaN if none).
     */
    get z() {
        return this._geometry.getCoordinate().z;
    },

    /** private: method[_create]
     *  :arg _coords: ``jts.geom.Coordinates``
     *
     *  Create a JTS geometry from JTS coordinates.
     */
    _create: function(coords) {
        return Geometry._factory.createPoint(_arrayToCoord(coords));
    }

});

/** private: staticmethod[_extractCoordinates]
 *  :arg _geometry: ``jts.geom.Geometry`` A JTS geometry object.
 *  :returns: ``Array`` An array of coordinates.
 *
 *  Extract a coordinates array from a JTS geometry.
 */
Point._extractCoordinates = function(_geometry) {
    var _coords = _geometry.getCoordinates();
    return _coordToArray(_coords[0]);
};

/** api: example
 *  Sample code to new point:
 * 
 *  .. code-block:: javascript
 * 
 *      var point = new geom.Point([-180, 90]);
 *      point.x;  // -180
 *      point.y;  // 90
 */

exports.Point = Point;
