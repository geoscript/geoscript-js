var jts = Packages.com.vividsolutions.jts;

/** api: module = geom */

/** api: (geom.Geometry) */

/** api: constructor
 *  .. class:: Geometry()
 *
 *      A Geometry instance should not be created directly.  
 *      Create an instance of a Geometry subclass instead.
 */
var Geometry = function() {    
};
Geometry.prototype = {

    /** api: property[_geometry]
     *  ``jts.geom.Geometry``
     */
     _geometry: undefined,

     /** api: property[_factory]
      *  ``jts.geom.GeometryFactory``
      *  A jts geometry factory.
      */
     _factory: new jts.geom.GeometryFactory()     
    
};


/** api: (geom.Point) */

/** api: (extends)
 *  geom.Geometry
 */

/** api: constructor
 *  .. class:: Point(coords, options)
 *      :arg coords: ``Array`` Coordinates array.
 *      :arg options: ``Object`` Options.
 *
 *      Create a new point.
 */
var Point = function(coords, options) {
    
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
Point.prototype = new Geometry();

/** api: example
 *  Sample code to new point:
 * 
 *  .. code-block:: javascript
 * 
 *      var point = geom.Point([-180, 90]);
 *      point.x;  // -180
 *      point.y;  // 90
 */

exports.Geometry = Geometry;
exports.Point = Point;
