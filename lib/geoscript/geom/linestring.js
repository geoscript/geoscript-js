var Geometry = require("geoscript/geom/geometry").Geometry;
var _arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
var _coordToArray = require("geoscript/geom/geometry")._coordToArray;
var util = require("geoscript/util");

/** api: (geom.LineString) */

/** api: (define)
 *  module = geom
 *  class = LineString
 */

/** api: (extends)
 *  geom/geometry.js
 */
var LineString = util.extend(Geometry, {
    
    /** api: constructor
     *  .. class:: LineString
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      Create a new linestring.
     */
    constructor: function LineString(coords) {
        Geometry.prototype.constructor.apply(this, [coords]);
    },

    /** private: method[_create]
     *  :arg coords: ``Array`` A coordinates array.
     *
     *  Create a JTS geometry from an array of coordinates.
     */
    _create: function(coords) {
        var _coords = new Array(coords.length);
        coords.forEach(function(c, i) {
            _coords[i] = _arrayToCoord(c);
        });
        return Geometry._factory.createLineString(_coords);
    },

    /** private: method[extractCoordinates]
     *  :arg _geometry: ``com.vividsolutions.jts.geom.Geometry``
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function(_geometry) {
        var _coords = _geometry.getCoordinates();
        return _coords.map(_coordToArray);
    }
    
});


/** api: example
 *  Sample code to new linestring:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var line = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      js> line.coordinates.length
 *      3
 *      js> line.length
 *      402.49223594996215
 */

exports.LineString = LineString;

// register a linestring factory for the module
var geom = require("geoscript/geom");
var Factory = require("geoscript/factory").Factory;
var _prepConfig = require("geoscript/geom/geometry")._prepConfig;

geom.register(new Factory(LineString, {
    handles: function(config) {
        config = _prepConfig(config);
        var capable = false;
        if (config.coordinates && config.coordinates instanceof Array) {
            for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
                var p = config.coordinates[i];
                if (p instanceof Array) {
                    var len = p.length;
                    if (len === 2 || len === 3) {
                        capable = true;
                        for (var j=0; j<len; ++j) {
                            capable = capable && (typeof p[j] === "number");
                        }
                    }
                }
            }
        }
        return capable;
    }
}));
