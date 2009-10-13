var Geometry = require("geoscript/geom/geometry").Geometry;
var arrayToCoord = require("geoscript/geom/geometry")._arrayToCoord;
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
    constructor: function(coords, options) {

        this.coordinates = coords;

        var coordinates = new Array(coords.length);
        coords.forEach(function(c, i) {
            coordinates[i] = arrayToCoord(c);
        });
        this._geometry = this._factory.createLineString(coordinates);
    
        /** api: property[length]
         *  ``Number``
         *  The linestring length.
         */
        this.length = this._geometry.length;

    }

});


/** api: example
 *  Sample code to new linestring:
 * 
 *  .. code-block:: javascript
 * 
 *      var line = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
 *      line.coordinates.length;  // 3
 *      line.length;  // 402.49223594996215
 */

exports.LineString = LineString;
