exports.Geometry = require("./geom/geometry").Geometry;
exports.Point = require("./geom/point").Point;
exports.LineString = require("./geom/linestring").LineString;
exports.Polygon = require("./geom/polygon").Polygon;
exports.GeometryCollection = require("./geom/collection").GeometryCollection;
exports.MultiPoint = require("./geom/multipoint").MultiPoint;
exports.MultiLineString = require("./geom/multilinestring").MultiLineString;
exports.MultiPolygon = require("./geom/multipolygon").MultiPolygon;

var jts = Packages.com.vividsolutions.jts;
/** 
 *  Used to calculate round caps for buffer operations.
 */
exports.BUFFER_CAP_ROUND = jts.operation.buffer.BufferOp.CAP_ROUND;

/** 
 *  Used to calculate square caps for buffer operations.
 */
exports.BUFFER_CAP_SQUARE = jts.operation.buffer.BufferOp.CAP_SQUARE;

/** 
 *  Used to calculate butt caps for buffer operations.
 */
exports.BUFFER_CAP_BUTT = jts.operation.buffer.BufferOp.CAP_BUTT;

