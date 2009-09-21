var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;

/** api: (geom.Point) */

/** api: (define)
 *  module = geom
 *  class = Point
 */

/** api: constructor
 *  .. class:: Point
 *  
 *      :arg coords: ``Array`` Coordinates array.
 *
 *      Create a new point.
 */
var Point = function(coords, options) {
    
    this.coordinates = coords;

    this._geometry = this._factory.createPoint(arrayToCoord(coords));    
    
    /** api: property[x]
     *  ``Number`` 
     *  The first coordinate value.
     */
    this.x = this._geometry.getX();

    /** api: property[y]
     *  ``Number`` 
     *  The second coordinate value.
     */
    this.y = this._geometry.getY();

    /** api: property[z]
     *  ``Number`` 
     *  The third coordinate value (or NaN if none).
     */
    this.z = this._geometry.getCoordinate().z;

};

/** api: (extends)
 *  geom/geometry.js
 */
Point.prototype = new Geometry();

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
