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
    
    /** private: property[TYPES]
     *  ``Array``
     *  Array of allowed geometry types for the collection.
     */
    TYPES: [Polygon],
    
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
     *      may be polygon coordinates or :class:`geom.Polygon` objects.
     */
    constructor: function MultiPolygon(coords) {
        GeometryCollection.prototype.constructor.apply(this, [coords]);
    }
    
});

exports.MultiPolygon = MultiPolygon;
