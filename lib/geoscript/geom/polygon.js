var Geometry = require("geoscript/geom/geometry").Geometry;
var LineString = require("geoscript/geom/linestring").LineString;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
var _prepConfig = require("geoscript/geom/geometry")._prepConfig;
var util = require("geoscript/util");

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
    constructor: function Polygon(config) {
        var config = _prepConfig(config);
        var coords = config.coordinates;
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
        Geometry.prototype.constructor.apply(this, [config]);
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
    },

    /** private: method[extractCoordinates]
     *  :arg _geometry: ``com.vividsolutions.jts.geom.Geometry``
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function(_geometry) {
        var coords = [];
        coords[0] = LineString.prototype._extractCoordinates(_geometry.getExteriorRing());
        var numHoles = this._geometry.getNumInteriorRing();
        for(var i=0; i<numHoles; ++i) {
            coords[i+1] = LineString.prototype._extractCoordinates(_geometry.getInteriorRingN(i));
        }
        return coords;
    }
    
});

/** api: example
 *  Sample code to new polygon:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var poly = new GEOM.Polygon([
 *        >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
 *        >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
 *        > ]);
 */

exports.Polygon = Polygon;

// register a polygon factory for the module
var geom = require("geoscript/geom");
var Factory = require("geoscript/factory").Factory;

geom.register(new Factory(Polygon, {
    handles: function(config) {
        config = _prepConfig(config);
        var capable = false;
        if (config.coordinates && config.coordinates instanceof Array) {
            for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
                var r = config.coordinates[i];
                if (r instanceof Array) {
                    for (var j=0, jj=r.length; j<jj; ++j) {
                        var p = r[j];
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
    }
}));
