var GeometryCollection = require("geoscript/geom/collection").GeometryCollection;
var Point = require("geoscript/geom/point").Point;
var util = require("geoscript/util");
var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiPoint
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiPoint = util.extend(GeometryCollection, {
    
    /** private: componentDimension
     *  ``Number``
     *  The dimension of component geometries.
     */
    componentDimension: 0,
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: jts.geom.MultiPoint,
    
    /** api: constructor
     *  .. class:: MultiPoint
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new multi-point geometry.  The items in the coords array
     *      may be point coordinates or :class:`Point` objects.
     */
    constructor: function MultiPoint(coords) {
        GeometryCollection.prototype.constructor.apply(this, [coords]);
    }
    
});

/** api: example
 *  Sample code to new multi-point:
 * 
 *  .. code-block:: javascript
 * 
 *      var p1 = new geom.Point([-180, 90]);
 *      var p2 = new geom.Point([-45, 45]);
 *      var mp = new geom.MultiPoint([p1, p2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      var mp = new geom.MultiPoint([
 *          [-180, 90], [-45, 45]
 *      ]);
 */

exports.MultiPoint = MultiPoint;
