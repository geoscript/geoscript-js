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
 *    js> var GEOM = require("geoscript/geom");
 */

require("./proj"); // needs to be initialized first
// define all geometry classes
Packages.org.geoscript.js.geom.Module.init(this);

var Factory = require("./factory").Factory;
var Registry = require("./registry").Registry;
var UTIL = require("./util");

var registry = new Registry();
var jts = Packages.org.locationtech.jts;

function prepConfig(config) {
  if (!config) {
    config = {};
  } else if (UTIL.isArray(config)) {
    config = {coordinates: config};
  }
  return config;
};

/** private: classes[] = geometry */
exports.Geometry = this["org.geoscript.js.geom.Geometry"];

/** api: classes[] = point */
exports.Point = this["org.geoscript.js.geom.Point"];

//register a point factory for the module
registry.register(new Factory(exports.Point, {
  handles: function(config) {
    config = prepConfig(config);
    var capable = false;
    if (config.coordinates && UTIL.isArray(config.coordinates)) {
      var len = config.coordinates.length;
      if (len == 2 || len == 3) {
        capable = true;
        for (var i=0; i<len; ++i) {
          capable = capable && (typeof config.coordinates[i] === "number");
        }
      }
    }
    return capable;
  }
}));

/** api: classes[] = linestring */
exports.LineString = this["org.geoscript.js.geom.LineString"];

//register a linestring factory for the module
registry.register(new Factory(exports.LineString, {
  handles: function(config) {
    config = prepConfig(config);
    var capable = false;
    if (config.coordinates && UTIL.isArray(config.coordinates)) {
      for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
        var p = config.coordinates[i];
        if (UTIL.isArray(p)) {
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

/** api: classes[] = polygon */
exports.Polygon = this["org.geoscript.js.geom.Polygon"];

//register a polygon factory for the module
registry.register(new Factory(exports.Polygon, {
  handles: function(config) {
    config = prepConfig(config);
    var capable = false;
    if (config.coordinates && UTIL.isArray(config.coordinates)) {
      for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
        var r = config.coordinates[i];
        if (UTIL.isArray(r)) {
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


/** private: classes[] = collection */
exports.GeometryCollection = this["org.geoscript.js.geom.GeometryCollection"];

//register a collection factory for the module
registry.register(new Factory(exports.GeometryCollection));

/** api: classes[] = multipoint */
exports.MultiPoint = this["org.geoscript.js.geom.MultiPoint"];

//register a multipoint factory for the module
registry.register(new Factory(exports.MultiPoint));

/** api: classes[] = multilinestring */
exports.MultiLineString = this["org.geoscript.js.geom.MultiLineString"];

//register a polygon factory for the module
registry.register(new Factory(exports.MultiLineString));

/** api: classes[] = multipolygon */
exports.MultiPolygon = this["org.geoscript.js.geom.MultiPolygon"];

//register a polygon factory for the module
registry.register(new Factory(exports.MultiPolygon, {
  handles: function(config) {
    config = prepConfig(config);
    var capable = false;
    if (config.coordinates && UTIL.isArray(config.coordinates)) {
      for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
        var c = config.coordinates[i];
        if (UTIL.isArray(c)) {
          for (var j=0, jj=c.length; j<jj; ++j) {
            var r = c[j];
            if (UTIL.isArray(r)) {
              for (var k=0, kk=r.length; k<kk; ++k) {
                var p = r[k];
                var len = p.length;
                if (len === 2 || len === 3) {
                  capable = true;
                  for (var l=0; l<len; ++l) {
                    capable = capable && (typeof p[l] === "number");
                  }
                }
              }
            }
          }
        }
      }
    }
    return capable;
  }
}));

/** api: classes[] = circularstring */
exports.CircularString = this["org.geoscript.js.geom.CircularString"];

//register a circularstring factory for the module
registry.register(new Factory(exports.CircularString, {
  handles: function(config) {
    config = prepConfig(config);
    var capable = false;
    if (config.coordinates && UTIL.isArray(config.coordinates)) {
      for (var i=0, ii=config.coordinates.length; i<ii; ++i) {
        var p = config.coordinates[i];
        if (UTIL.isArray(p)) {
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

/** api: classes[] = compoundcurve */
exports.CompoundCurve = this["org.geoscript.js.geom.CompoundCurve"];

//register a compoundcurve factory for the module
registry.register(new Factory(exports.CompoundCurve));

/** api: classes[] = bounds */
exports.Bounds = this["org.geoscript.js.geom.Bounds"];

//register a bounds factory for the module
registry.register(new Factory(exports.Bounds, {
  handles: function(config) {
    var capable = (
      typeof config.minX === "number"
    ) && (
      typeof config.maxX === "number"
    ) && (
      typeof config.minY === "number"
    ) && (
      typeof config.maxY === "number"
    );
    return capable;
  }
}));

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

exports.create = registry.create;
