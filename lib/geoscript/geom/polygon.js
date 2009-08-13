var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;

/** api: (geom.Polygon) */

/** api: (define)
 *  module = geom
 *  class = Polygon
 */

/** api: constructor
 *  .. class:: Polygon(coords, options)
 *      :arg coords: ``Array`` Coordinates array.
 *      :arg options: ``Object`` Options.
 *
 *      Create a new polygon.
 */
var Polygon = function(coords, options) {

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
    this.coordinates = coords;
    
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

};

/** api: (extends)
 *  geom.Geometry
 */
Polygon.prototype = new Geometry();

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