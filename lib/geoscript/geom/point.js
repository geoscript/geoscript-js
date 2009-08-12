var jts = Packages.com.vividsolutions.jts;
var Geometry = require("geoscript/geom/geometry").Geometry;

/** api: (geom.Point) */

/** api: (define)
 *  module = geom
 *  class = Point
 */

/** api: constructor
 *  .. class:: Point(coords, options)
 *      :arg coords: ``Array`` Coordinates array.
 *      :arg options: ``Object`` Options.
 *
 *      Create a new point.
 */
var Point = function(coords, options) {
    
    this.coordinates = coords;

    this._geometry = this._factory.createPoint(
        new jts.geom.Coordinate(coords[0], coords[1])
    );
    
    
    /** api: property[x]
     *  ``Number`` 
     *  The first coordinate value.
     */
    this.x = this._geometry.x;

    /** api: property[y]
     *  ``Number`` 
     *  The second coordinate value.
     */
    this.y = this._geometry.y;

};

/** api: (extends)
 *  geom.Geometry
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
