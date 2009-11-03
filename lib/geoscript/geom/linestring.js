var Geometry = require("geoscript/geom/geometry").Geometry;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
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

    /** private: method[create_]
     *  :arg coords: ``Array`` A coordinates array.
     *
     *  Create a JTS geometry from an array of coordinates.
     */
    create_: function(coords) {
        var _coords = new Array(coords.length);
        coords.forEach(function(c, i) {
            _coords[i] = _arrayToCoord(c);
        });
        return Geometry._factory.createLineString(_coords);
    }
    
});


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
