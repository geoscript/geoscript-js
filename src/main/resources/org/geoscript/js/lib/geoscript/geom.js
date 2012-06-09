require("geoscript/proj"); // needs to be initialized first
Packages.org.geoscript.js.geom.Module.init(this);

/** private: classes[] = geometry */
exports.Geometry = this["org.geoscript.js.geom.Geometry"];

/** api: classes[] = point */
exports.Point = this["org.geoscript.js.geom.Point"];

/** api: classes[] = linestring */
exports.LineString = this["org.geoscript.js.geom.LineString"];

/** api: classes[] = polygon */
exports.Polygon = this["org.geoscript.js.geom.Polygon"];

/** private: classes[] = collection */
exports.GeometryCollection = this["org.geoscript.js.geom.GeometryCollection"];

/** api: classes[] = multipoint */
exports.MultiPoint = this["org.geoscript.js.geom.MultiPoint"];

/** api: classes[] = multilinestring */
exports.MultiLineString = this["org.geoscript.js.geom.MultiLineString"];

/** api: classes[] = multipolygon */
exports.MultiPolygon = this["org.geoscript.js.geom.MultiPolygon"];

/** api: classes[] = bounds */
exports.Bounds = this["org.geoscript.js.geom.Bounds"];
