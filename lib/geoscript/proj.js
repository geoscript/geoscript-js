var geom = require('geoscript/geom');
var geotools = Packages.org.geotools;

// Supress non-critical messages
var logger = geotools.util.logging.Logging.getLogger(
    "org.geotools.referencing.factory.epsg"
);
logger.setLevel(java.util.logging.Level.WARNING); 

// Force GeoTools' referencing system to use x,y order
if (!java.lang.System.getProperty("org.geotools.referencing.forceXY")) {
    java.lang.System.setProperty("org.geotools.referencing.forceXY", "true");
}
var Hints = geotools.factory.Hints;
if (!Hints.getSystemDefault(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER)) {
    Hints.putSystemDefault(Hints.FORCE_AXIS_ORDER_HONORING, "http");
}

var GeometryTX = geotools.geometry.jts.GeometryCoordinateSequenceTransformer;
var crs = geotools.referencing.CRS;

var transform = function(geometry, from, to) {
    if (!(from instanceof Projection)) {
        from = new Projection(from);
    }
    if (!(to instanceof Projection)) {
        to = new Projection(to);
    }
    var tx = crs.findMathTransform(from._proj, to._proj);
    var gt = new GeometryTX();
    gt.mathTransform = tx;
    var jtsGeom = gt.transform(geometry._geometry);
    return geom.Geometry.fromJTS(jtsGeom);
};

var Projection = function(id) {
    var proj;
    try {
        proj = crs.decode(id);
    } catch(err) {
        try {
            proj = crs.parseWKT(id);
        } catch(err) {
            throw "Unable to create Projection object from " + id
        }
    }
    this._proj = proj;
    this.name = String(proj.name);
    this.code = crs.lookupIdentifier(proj, true) || null;
};

exports.transform = transform;
exports.Projection = Projection;
