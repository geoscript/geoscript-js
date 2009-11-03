var Geometry = require("geoscript/geom/geometry").Geometry;
var LineString = require("geoscript/geom/linestring").LineString;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
var util = require("geoscript/util");

/** api: (geom.Polygon) */

/** api: (define)
 *  module = geom
 *  class = Polygon
 */

/** api: (extends)
 *  geom/geometry.js
 */
var Polygon = util.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: Polygon
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new polygon.
     */
    constructor: function(coords) {
        if (coords) {
            // close all rings
            coords.forEach(function(c, i) {
                var first = c[0];
                var last = c[c.length-1];
                if (first[0] !== last[0] ||
                    first[1] !== last[1] ||
                    first[2] !== last[2]) {
                    c.push(first.slice());
                }
            });
        }
        Geometry.prototype.constructor.apply(this, [coords]);
    },
    
    /** private: method[_create]
     *  :arg coords: ``Array`` A coordinates array.
     *
     *  Create a JTS geometry from an array of coordinates.
     */
    _create: function(coords) {
        var exterior = coords[0];
        var interiors = coords.slice(1);
        
        var shell = Geometry._factory.createLinearRing(exterior.map(_arrayToCoord));

        var holes = interiors.map(function(r, i) {
            return Geometry._factory.createLinearRing(r.map(_arrayToCoord));
        });

        return Geometry._factory.createPolygon(shell, holes);
    }
    
});

/** private: staticmethod[_extractCoordinates]
 *  :arg _geometry: ``jts.geom.Geometry`` A JTS geometry object.
 *  :returns: ``Array`` An array of coordinates.
 *
 *  Extract a coordinates array from a JTS geometry.
 */
Polygon._extractCoordinates = function(_geometry) {
    var coords = [];
    coords[0] = LineString._extractCoordinates(_geometry.getExteriorRing());
    var numHoles = _geometry.getNumInteriorRing();
    for(var i=0; i<numHoles; ++i) {
        coords[i+1] = LineString._extractCoordinates(_geometry.getInteriorRingN(i));
    }
    return coords;
};

/** api: example
 *  Sample code to new polygon:
 * 
 *  .. code-block:: javascript
 * 
 *      var poly = new geom.Polygon([
 *          [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *          [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *      ]);
 */

exports.Polygon = Polygon;