var Factory = require("../factory").Factory;
var GeometryCollection = require("./collection").GeometryCollection;
var LineString = require("./linestring").LineString;
var UTIL = require("../util");
var GEOM_UTIL = require("./util");

var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiLineString
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiLineString = UTIL.extend(GeometryCollection, {
    
    /** private: componentDimension
     *  ``Number``
     *  The dimension of component geometries.
     */
    componentDimension: 1,
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: jts.geom.MultiLineString,
    
    /** api: property[endPoints]
     *  ``Array``
     *  List all start and end points for all components.
     */
    get endPoints() {
        var points = [];
        this.components.forEach(function(line) {
            points.push(line.startPoint, line.endPoint);
        });
        return points;
    },

    /** api: constructor
     *  .. class:: MultiLineString
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new multi-linestring geometry.  The items in the coords array
     *      may be linestring coordinates or :class:`LineString` objects.
     */
    constructor: function MultiLineString(coords) {
        GeometryCollection.prototype.constructor.apply(this, [coords]);
    }
    
});

/** api: example
 *  Sample code to new multi-linestring:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var l1 = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      js> var l2 = new GEOM.LineString([[180, -90], [0, 0], [-180, 90]]);
 *      js> var ml = new GEOM.MultiLineString([l1, l2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var ml = new GEOM.MultiLineString([
 *        >     [[-180, -90], [0, 0], [180, 90]],
 *        >     [[180, -90], [0, 0], [-180, 90]]
 *        > ]);
 */

exports.MultiLineString = MultiLineString;

// register a polygon factory for the module
GEOM_UTIL.register(new Factory(MultiLineString));
