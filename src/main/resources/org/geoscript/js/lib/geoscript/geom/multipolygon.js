var Factory = require("../factory").Factory;
var GeometryCollection = require("./collection").GeometryCollection;
var Polygon = require("./polygon").Polygon;
var GEOM_UTIL = require("./util");
var UTIL = require("../util");

var jts = Packages.com.vividsolutions.jts;

/** api: (define)
 *  module = geom
 *  class = MultiPolygon
 */

/** api: (extends)
 *  geom/collection.js
 */
var MultiPolygon = UTIL.extend(GeometryCollection, {
    
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
 *      js> var p1 = new GEOM.Polygon([
 *        >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *        >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *        > ]);
 *      js> var p2 = new GEOM.Polygon([
 *        >     [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
 *        > ]);
 *      js> var mp = new GEOM.MultiPolygon([p1, p2]);
 *
 *  Alternate method to create the same geometry as above:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var mp = new GEOM.MultiPolygon([
 *        >     [
 *        >         [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *        >         [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *        >     ], [
 *        >         [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
 *        >     ]
 *        > ]);
 */

exports.MultiPolygon = MultiPolygon;

// register a polygon factory for the module
GEOM_UTIL.register(new Factory(MultiPolygon, {
    handles: function(config) {
        config = GEOM_UTIL._prepConfig(config);
        var capable = false;
        if (config.coordinates && UTIL.isArray(config.coordinates)) {
            for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
                var c = config.coordinates[i];
                if (UTIL.isArray(c)) {
                    for (var j=0, jj=c.length; j<jj; ++j) {
                        var r = c[j];
                        if (UTIL.isArray(r)) {
                            for (var k=0, kk=r.length; k<kk; ++k) {
                                var p = r[k];
                                var len = p.length;
                                if (len === 2 || len === 3) {
                                    capable = true;
                                    for (var l=0; l<len; ++l) {
                                        capable = capable && (typeof p[l] === "number");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return capable;
    }
}));
