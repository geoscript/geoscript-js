var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
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
    
    /** api: property[x]
     *  ``Number`` 
     *  The first coordinate value.
     */
    x: null,

    /** api: property[y]
     *  ``Number`` 
     *  The second coordinate value.
     */
    y: null,

    /** api: property[z]
     *  ``Number`` 
     *  The third coordinate value (or NaN if none).
     */
    z: null,

    /** api: constructor
     *  .. class:: Point
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new point.
     */
    constructor: function(coords) {

        Geometry.prototype.constructor.apply(this, [coords]);

        this._geometry = this._factory.createPoint(arrayToCoord(coords));    

        this.x = this._geometry.getX();
        this.y = this._geometry.getY();
        this.z = this._geometry.getCoordinate().z;

    }

});

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
