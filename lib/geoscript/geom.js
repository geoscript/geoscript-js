

var registry = [];

var register = function(factory) {
    registry.push(factory);
};

var create = function(config) {    
    var candidate, factory;
    for (var i=0, ii=registry.length; i<ii; ++i) {
        candidate = registry[i];
        if (candidate.type === config.type) {
            factory = candidate;
            break;
        }
        if (!factory && candidate.handles(config)) {
            factory = candidate;
        }
    }
    if (!factory) {
        throw "Can't create object from config";
    }
    return factory.create(config);    
};

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

exports.create = create;
exports.register = register;
exports.Geometry = require("./geom/geometry").Geometry;
exports.Point = require("./geom/point").Point;
exports.LineString = require("./geom/linestring").LineString;
exports.Polygon = require("./geom/polygon").Polygon;
exports.GeometryCollection = require("./geom/collection").GeometryCollection;
exports.MultiPoint = require("./geom/multipoint").MultiPoint;
exports.MultiLineString = require("./geom/multilinestring").MultiLineString;
exports.MultiPolygon = require("./geom/multipolygon").MultiPolygon;

