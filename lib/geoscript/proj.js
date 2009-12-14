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
    
    cache: null,
    
    constructor: function Projection(id) {
        this.cache = {};
        if (id) {
            this.id = id;
        }
    },
    
    get id() {
        var id = null;
        if (this._projection) {
            id = this.cache.id;
            if (!id) {
                var _id = CRS.lookupIdentifier(this._projection, true);
                if (_id) {
                    id = String(_id);
                    this.cache.id = id;
                }
            }
        }
        return id;
    },
    
    set id(id) {
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
        this.cache = {};
        this._projection = _projection;
    },
    
    get wkt() {
        var wkt = null;
        if (this._projection) {
            wkt = this.cache.wkt;
            if (!wkt) {
                wkt = String(this._projection.toString());
                this.cache.wkt = wkt;
            }
        }
        return wkt;
    },
    
    toFullString: function() {
        return this.id;
    }
    
});

Projection.from_ = function(_projection) {
    var projection = new Projection();
    projection._projection = _projection;
    return projection;
};

exports.transform = transform;
exports.Projection = Projection;
