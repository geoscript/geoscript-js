/** api: module = geom */

/** api: synopsis
 *  Geometry related functionality.
 */

/** api: summary
 *  The :mod:`geom` module provides a provides constructors for point, line,
 *  polygon and multi-part geometries.
 *
 *  .. code-block:: javascript
 *  
 *      js> var GEOM = require("geoscript/geom");
 */

var jts = Packages.com.vividsolutions.jts;
var wktReader = new jts.io.WKTReader();

/** api: data[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
exports.BUFFER_CAP_ROUND = jts.operation.buffer.BufferOp.CAP_ROUND;

/** api: data[BUFFER_CAP_SQUARE]
 *  Used to calculate square caps for buffer operations.
 */
exports.BUFFER_CAP_SQUARE = jts.operation.buffer.BufferOp.CAP_SQUARE;

/** api: data[BUFFER_CAP_BUTT] 
 *  Used to calculate butt caps for buffer operations.
 */
exports.BUFFER_CAP_BUTT = jts.operation.buffer.BufferOp.CAP_BUTT;

var util = require("geoscript/util");
util.createRegistry(exports);

/** api: classes[] = geometry */
exports.Geometry = require("./geom/geometry").Geometry;

/** api: classes[] = point */
exports.Point = require("./geom/point").Point;

/** api: classes[] = linestring */
exports.LineString = require("./geom/linestring").LineString;

/** api: classes[] = polygon */
exports.Polygon = require("./geom/polygon").Polygon;

/** api: classes[] = collection */
exports.GeometryCollection = require("./geom/collection").GeometryCollection;

/** api: classes[] = multipoint */
exports.MultiPoint = require("./geom/multipoint").MultiPoint;

/** api: classes[] = multilinestring */
exports.MultiLineString = require("./geom/multilinestring").MultiLineString;

/** api: classes[] = multipolygon */
exports.MultiPolygon = require("./geom/multipolygon").MultiPolygon;

/** api: method[fromWKT]
 *  :arg wkt: ``String`` The Well-Known Text representation of a geometry.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry from WKT.  The specific geometry type depends on the
 *  given WKT.
 */
exports.fromWKT = function(wkt) {
    var _geometry = wktReader.read(wkt);
    return exports.Geometry.from_(_geometry);
};
