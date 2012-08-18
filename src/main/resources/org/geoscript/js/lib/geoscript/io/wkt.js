require("../geom"); // initialize Geometry prototypes before wrapping

var wkt = Packages.org.geoscript.js.io.WKT.init(this);

/** api: method[read]
 *  :arg wkt: ``String`` The Well-Known Text representation of a geometry.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry from WKT.  The specific geometry type depends on the
 *  given WKT.
 */
exports.read = wkt.read;

/** api: method[write]
 *  :arg geometry: :class:`geom.Geometry` A geometry.
 *  :returns: ``String`` The Well-Known Text representation of a geometry.
 *
 *  Generate a Well-Known Text string from a geometry.
 */
exports.write = wkt.write;