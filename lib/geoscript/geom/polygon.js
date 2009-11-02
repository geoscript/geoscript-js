var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
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

        // close all rings
        var exterior, interiors = [];
        coords.forEach(function(c, i) {
            var first = c[0];
            var last = c[c.length-1];
            if (first[0] !== last[0] ||
                first[1] !== last[1] ||
                first[2] !== last[2]) {
                c.push(first.slice());
            }
            if (i === 0) {
                exterior = c;
            } else {
                interiors[i-1] = c;
            }
        });

        Geometry.prototype.constructor.apply(this, [coords]);
    
        var shellCoords = [];
        exterior.forEach(function(c, i) {
            shellCoords[i] = arrayToCoord(c);
        });
        var shell = this._factory.createLinearRing(shellCoords);
    
        var holes = [];
        interiors.forEach(function(r, i) {
            var ringCoords = [];
            r.forEach(function(c, j) {
                ringCoords[j] = arrayToCoord(c);
            });
            holes[i] = this._factory.createLinearRing(ringCoords);
        }, this);

        this._geometry = this._factory.createPolygon(shell, holes);

    }
    
});

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