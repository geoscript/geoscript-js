var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;

/** api: (geom.LineString) */

/** api: (define)
 *  module = geom
 *  class = LineString
 */

/** api: constructor
 *  .. class:: LineString
 *  
 *      :arg coords: ``Array`` Coordinates array.
 *
 *      Create a new linestring.
 */
var LineString = function(coords, options) {

    this.coordinates = coords;

    var coordinates = new Array(coords.length);
    coords.forEach(function(c, i) {
        coordinates[i] = arrayToCoord(c);
    });
    this._geometry = this._factory.createLineString(coordinates);
    
    /** api: property[length]
     *  ``Number``
     *  The linestring length.
     */
    this.length = this._geometry.length;

};

/** api: (extends)
 *  geom/geometry.js
 */
LineString.prototype = new Geometry();

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
