var GeometryCollection = require("geoscript/geom/collection").GeometryCollection;
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
var MultiLineString = util.extend(GeometryCollection, {
    
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
 *      var l1 = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      var l2 = new geom.LineString([[180, -90], [0, 0], [-180, 90]]);
 *      var ml = new geom.MultiLineString([l1, l2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      var ml = new geom.MultiLineString([
 *          [[-180, -90], [0, 0], [180, 90]],
 *          [[180, -90], [0, 0], [-180, 90]]
 *      ]);
 */

exports.MultiLineString = MultiLineString;

// register a polygon factory for the module
var geom = require("geoscript/geom");
geom.register({
    type: "MultiLineString",
    handles: function(config) {
        var capable = false;
        if (config.coordinates && config.coordinates instanceof Array) {
            for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
                var l = config.coordinates[i];
                if (l instanceof Array) {
                    for (var j=0, jj=l.length; j<jj; ++j) {
                        var p = l[j];
                        var len = p.length;
                        if (len === 2 || len === 3) {
                            capable = true;
                            for (var k=0; k<len; ++k) {
                                capable = capable && (typeof p[k] === "number");
                            }
                        }
                    }
                }
            }
        }
        return capable;
    },
    create: function(config) {
        return new MultiLineString(config.coordinates);
    }
});
