var Geometry = require("../geometry").Geometry;

var jts = Packages.com.vividsolutions.jts;
var wktReader = new jts.io.WKTReader();
var wktWriter = new jts.io.WKTWriter();

/** private: method[read]
 *  :arg wkt: ``String`` The Well-Known Text representation of a geometry.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry from WKT.  The specific geometry type depends on the
 *  given WKT.
 */
var read = function(str) {

    var _geometry = wktReader.read(str);
    return Geometry.from_(_geometry);

};

/** private: method[write]
 *  :arg geometry: :class:`geom.Geometry` A geometry.
 *  :returns: ``String`` The Well-Known Text representation of a geometry.
 *
 *  Generate a Well-Known Text string from a geometry.
 */
var write = function(geometry) {
    
    var str;
    if (geometry._geometry) {
        str = String(wktWriter.write(geometry._geometry));
    } else {
        str = "undefined";
    }
    return str;
    
};

exports.read = read;
exports.write = write;
