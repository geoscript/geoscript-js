var GEOM_UTIL = require("./geom/util");

/** api: module = geom */

/** api: synopsis
 *  A collection of geometry types.
 */

/** api: summary
 *  The :mod:`geom` module provides a provides constructors for point, line,
 *  polygon and multi-part geometries.
 *
 *  .. code-block:: javascript
 *  
 *      js> var GEOM = require("geoscript/geom");
 */

/** api: data[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
exports.BUFFER_CAP_ROUND = GEOM_UTIL.BUFFER_CAP_ROUND;

/** api: data[BUFFER_CAP_SQUARE]
 *  Used to calculate square caps for buffer operations.
 */
exports.BUFFER_CAP_SQUARE = GEOM_UTIL.BUFFER_CAP_SQUARE;

/** api: data[BUFFER_CAP_BUTT] 
 *  Used to calculate butt caps for buffer operations.
 */
exports.BUFFER_CAP_BUTT = GEOM_UTIL.BUFFER_CAP_BUTT;

/** private: classes[] = geometry */
exports.Geometry = require("./geom/geometry").Geometry;

/** api: classes[] = point */
exports.Point = require("./geom/point").Point;

/** api: classes[] = linestring */
exports.LineString = require("./geom/linestring").LineString;

/** api: classes[] = polygon */
exports.Polygon = require("./geom/polygon").Polygon;

/** private: classes[] = collection */
exports.GeometryCollection = require("./geom/collection").GeometryCollection;

/** api: classes[] = multipoint */
exports.MultiPoint = require("./geom/multipoint").MultiPoint;

/** api: classes[] = multilinestring */
exports.MultiLineString = require("./geom/multilinestring").MultiLineString;

/** api: classes[] = multipolygon */
exports.MultiPolygon = require("./geom/multipolygon").MultiPolygon;

/** api: classes[] = bounds */
exports.Bounds = require("./geom/bounds").Bounds;


/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry given a configuration object.
 */
exports.create = GEOM_UTIL.create;
