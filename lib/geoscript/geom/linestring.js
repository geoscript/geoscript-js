var Geometry = require("geoscript/geom/geometry").Geometry;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
var _coordToArray = require("geoscript/geom/geometry")._coordToArray;
var util = require("geoscript/util");

/** api: (geom.LineString) */

/** api: (define)
 *  module = geom
 *  class = LineString
 */

/** api: (extends)
 *  geom/geometry.js
 */
var LineString = util.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: LineString
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new linestring.
     */
    constructor: function(coords) {
        Geometry.prototype.constructor.apply(this, [coords]);
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
    }
    
});

/** private: staticmethod[_extractCoordinates]
 *  :arg _geometry: ``jts.geom.Geometry`` A JTS geometry object.
 *  :returns: ``Array`` An array of coordinates.
 *
 *  Extract a coordinates array from a JTS geometry.
 */
LineString._extractCoordinates = function(_geometry) {
    var _coords = _geometry.getCoordinates();
    return _coords.map(_coordToArray);
};

/** api: example
 *  Sample code to new linestring:
 * 
 *  .. code-block:: javascript
 * 
 *      var line = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      line.coordinates.length;  // 3
 *      line.length;  // 402.49223594996215
 */

exports.LineString = LineString;
