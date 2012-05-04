var Registry = require("../registry").Registry;
var UTIL = require("../util");

var jts = Packages.com.vividsolutions.jts;
var registry = new Registry();

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry given a configuration object.
 */
exports.create = registry.create;

/** private: method[register] */
exports.register = registry.register;

/** private: data[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
exports.BUFFER_CAP_ROUND = jts.operation.buffer.BufferOp.CAP_ROUND;

/** private: data[BUFFER_CAP_SQUARE]
 *  Used to calculate square caps for buffer operations.
 */
exports.BUFFER_CAP_SQUARE = jts.operation.buffer.BufferOp.CAP_SQUARE;

/** private: data[BUFFER_CAP_BUTT] 
 *  Used to calculate butt caps for buffer operations.
 */
exports.BUFFER_CAP_BUTT = jts.operation.buffer.BufferOp.CAP_BUTT;

exports._getMethod = function(_geometry, name) {
    var method;
    // prepared geometry has a limited set of methods
    if (!_geometry[name]) {
        // if a prepared geometry doesn't have the given method, use the underlying geometry
        _geometry = _geometry.getGeometry();
    }
    return function() {
        return _geometry[name].apply(_geometry, arguments);
    };
};

exports._arrayToCoord = function(list) {
    var z = (2 in list) ? list[2] : NaN;
    return new jts.geom.Coordinate(list[0], list[1], z);
};

exports._coordToArray = function(coordinate) {
    var list = [coordinate.x, coordinate.y];
    var z = coordinate.z;
    if (!isNaN(z)) {
        list.push(z);
    }
    return list;
};

exports._prepConfig = function(config) {
    if (!config) {
        config = {};
    } else if (UTIL.isArray(config)) {
        config = {coordinates: config};
    }
    return config;
};

