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
    
    /** private: property[TYPES]
     *  ``Array``
     *  Array of allowed geometry types for the collection.
     */
    TYPES: [Point],
    
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
     *      Create a new multipoint geometry.  The items in the coords array
     *      may be point coordinates or :class:`geom.Point` objects.
     */
    constructor: function MultiPoint(coords) {
        GeometryCollection.prototype.constructor.apply(this, [coords]);
    }
    
});

exports.MultiPoint = MultiPoint;
