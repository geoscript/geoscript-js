/** api: module = geom/io/json */

/** api: synopsis
 *  Reading and writing JSON.
 */

/** api: summary
 *  The :mod:`geom/io/json` module exports functions to read and write 
 *  geometries.
 *
 *  .. code-block:: javascript
 *  
 *      js> var json = require("geoscript/geom/io/json");
 */

var UTIL = require("../../util");
var GEOM = require("../../geom");

/** api: method[read]
 *  :arg str: ``String``
 *  :returns: :class:`geom.Geometry`
 *  
 *  Creates a geometry from a JSON string.  See http://geojson.org/ for details
 *  on the format.
 *
 *  Example use:
 *
 *  .. code-block:: javascript
 *  
 *      js> var json = require("geoscript/geom/io/json");
 *      js> var str = '{"type": "Point", "coordinates": [0, 1]}';
 *      js> var point = json.read(str);
 *      js> point.x
 *      0
 *      js> point.y
 *      1
 */
var read = function(str) {
    
    var obj = JSON.parse(str);
    if (!obj.type) {
        throw new Error("Invalid GeoJSON, no type member.");
    }
    
    var collection = obj.type === "GeometryCollection";
    var configs;
    if (collection) {
        configs = obj.geometries;
        // TODO: deal with crs
    } else {
        configs = [obj];
    }

    var num = configs.length;
    var geometries = new Array(num);
    for (var i=0; i<num; ++i) {
        geometries[i] = GEOM.create(configs[i]);
    }
    return collection ? geometries : geometries[0];

};

/** api: method[write]
 *  :arg geometries: :class:`geom.Geometry`
 *  :returns: ``String``
 *  
 *  Serializes a geometry as a JSON string.  See http://geojson.org/ for details
 *  on the format.
 *
 *  Example use:
 *
 *  .. code-block:: javascript
 *  
 *      js> var json = require("geoscript/geom/io/json");
 *      js> var Point = require("geoscript/geom").Point;
 *      js> var point = new Point([0, 1]);
 *      js> var str = json.write(point);
 *      js> str
 *      {"type": "Point", "coordinates": [0, 1]}
 */
var write = function(geometries) {
    
    var collection = true;
    if (!(UTIL.isArray(config))) {
        collection = false;
        geometries = [geometries];
    }
    
    var num = geometries.length;
    var configs = new Array(num);
    for (var i=0; i<num; ++i) {
        configs[i] = geometries[i].config;
    }
    
    var obj;
    if (collection) {
        obj = {
            type: "GeometryCollection",
            geometries: configs
        };
    } else {
        obj = configs[0];
    }
    
    return JSON.stringify(obj);
    
};

exports.read = read;
exports.write = write;
