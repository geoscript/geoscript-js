var geom = require("geoscript/geom");
var util = require("geoscript/util");
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
    var gt = new GeometryTX();
    gt.mathTransform = crs.findMathTransform(from._projection, to._projection);
    var _geometry = gt.transform(geometry._geometry);
    return geom.Geometry.from_(_geometry);
};

var Projection = util.extend(Object, {
    
    constructor: function(id) {
        var _projection;
        // duck type GeoTools CRS
        // TODO: confirm instanceof doesn't work here
        if (typeof id.getCoordinateSystem === "function") {
            _projection = id;
        } else {
            try {
                // could be SRID
                _projection = crs.decode(id);
            } catch(err) {
                try {
                    // could be Well-Known Text
                    _projection = crs.parseWKT(id);
                } catch(err) {
                    throw "Unable to create Projection object from " + id
                }
            }
        }
        this._projection = _projection;
        this.name = String(_projection.name);
        this.code = crs.lookupIdentifier(_projection, true) || null;
    }
    
});

exports.transform = transform;
exports.Projection = Projection;
