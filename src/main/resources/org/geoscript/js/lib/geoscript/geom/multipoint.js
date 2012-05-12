var Factory = require("../factory").Factory;
var GeometryCollection = require("./collection").GeometryCollection;
var Point = require("./point").Point;
var UTIL = require("../util");
var GEOM_UTIL = require("./util");

var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiPoint
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiPoint = UTIL.extend(GeometryCollection, {
    
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
 *      js> var p1 = new GEOM.Point([-180, 90]);
 *      js> var p2 = new GEOM.Point([-45, 45]);
 *      js> var mp = new GEOM.MultiPoint([p1, p2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var mp = new GEOM.MultiPoint([
 *        >     [-180, 90], [-45, 45]
 *        > ]);
 */

exports.MultiPoint = MultiPoint;

// register a multipoint factory for the module
GEOM_UTIL.register(new Factory(MultiPoint));
