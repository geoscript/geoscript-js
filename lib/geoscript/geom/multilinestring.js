var Collection = require("geoscript/geom/collection").Collection;
var LineString = require("geoscript/geom/linestring").LineString;
var util = require("geoscript/util");
var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiLineString
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiLineString = util.extend(Collection, {
    
    /** private: property[TYPES]
     *  ``Array``
     *  Array of allowed geometry types for the collection.
     */
    TYPES: [LineString],
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: jts.geom.MultiLineString,
    
    /** api: constructor
     *  .. class:: MultiLineString
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new multilinestring geometry.  The items in the coords array
     *      may be linestring coordinates or :class:`geom.LineString` objects.
     */
    constructor: function MultiLineString(coords) {
        Collection.prototype.constructor.apply(this, [coords]);
    }
    
});

exports.MultiLineString = MultiLineString;
