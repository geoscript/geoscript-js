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
var CRS = geotools.referencing.CRS;

var transform = function(geometry, from, to) {
    if (!(from instanceof Projection)) {
        from = new Projection(from);
    }
    if (!(to instanceof Projection)) {
        to = new Projection(to);
    }
    var gt = new GeometryTX();
    gt.mathTransform = CRS.findMathTransform(from._projection, to._projection);
    var _geometry = gt.transform(geometry._geometry);
    return geom.Geometry.from_(_geometry);
};

var Projection = util.extend(Object, {
    
    constructor: function(id) {
        if (id) {
            this.setId(id);
        }
    },
    
    setId: function(id) {
        if (!this._projection) {
            var _projection;
            try {
                // could be SRID
                _projection = CRS.decode(id);
            } catch(err) {
                try {
                    // could be Well-Known Text
                    _projection = CRS.parseWKT(id);
                } catch(err) {
                    throw "Unable to create Projection object from " + id;
                }
            }
            this._projection = _projection;
        }
        this.wkt = String(this._projection.toString());
        this.id = CRS.lookupIdentifier(this._projection, true) || null;        
    },
    
    toString: function() {
        return this.id;
    }
    
});

Projection.from_ = function(_projection) {
    var projection = new Projection();
    projection._projection = _projection;
    projection.setId(CRS.lookupIdentifier(_projection, true));
    return projection;
};


exports.transform = transform;
exports.Projection = Projection;
