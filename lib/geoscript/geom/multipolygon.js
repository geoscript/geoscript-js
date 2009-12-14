var GeometryCollection = require("geoscript/geom/collection").GeometryCollection;
var Polygon = require("geoscript/geom/polygon").Polygon;
var util = require("geoscript/util");
var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiPolygon
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiPolygon = util.extend(GeometryCollection, {
    
    /** private: componentDimension
     *  ``Number``
     *  The dimension of component geometries.
     */
    componentDimension: 2,
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: jts.geom.MultiPolygon,
    
    /** api: constructor
     *  .. class:: MultiPolygon
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new multipolygon geometry.  The items in the coords array
     *      may be polygon coordinates or :class:`Polygon` objects.
     */
    constructor: function MultiPolygon(coords) {
        GeometryCollection.prototype.constructor.apply(this, [coords]);
    }
    
});

/** api: example
 *  Sample code to new multi-polygon:
 * 
 *  .. code-block:: javascript
 * 
 *      var p1 = new geom.Polygon([
 *          [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *          [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *      ]);
 *      var p2 = new geom.Polygon([
 *          [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
 *      ]);
 *      var mp = new geom.MultiPolygon([p1, p2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      var mp = new geom.MultiPolygon([
 *          [
 *              [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *              [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *          ], [
 *              [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
 *          ]
 *      ]);
 */

exports.MultiPolygon = MultiPolygon;
