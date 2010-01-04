var util = require("geoscript/util");
var geom = require("geoscript/geom");

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

var CRS = geotools.referencing.CRS;
var GeometryTX = geotools.geometry.jts.GeometryCoordinateSequenceTransformer;


/** api: (define)
 *  module = proj
 *  class = Projection
 */
var Projection = util.extend(Object, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,
    
    /** api: constructor
     *  .. class:: Projection
     *  
     *      :arg id: ``String`` Coordinate reference system identifier or 
     *          well-known text for the projection.
     *
     *      Create a new projection object.
     */
    constructor: function Projection(id) {
        this.cache = {};
        if (id) {
            this.id = id;
        }
    },
    
    /** api: method[equals]
     *  :arg projection: :class:`proj.Projection`
     *  :returns: ``Boolean`` The two projections are equivalent.
     *
     *  Determine if this projection is equivalent to the given projection.
     */
    equals: function(projection) {
        return this.id === projection.id;
    },
    
    /** api: method[transform]
     *  :arg geometry: :class:`geom.Geometry`
     *  :arg to: :class:`proj.Projection`
     *  :returns: :class:`geom.Geometry`
     *
     *  Transform a geometry from this projection to the given projection.
     *  Returns a new geometry object of the same type as the original.
     */
    transform: function(geometry, to) {
        if (!(to instanceof Projection)) {
            to = new Projection(to);
        }
        var gt = new GeometryTX();
        gt.mathTransform = CRS.findMathTransform(this._projection, to._projection);
        var _geometry = gt.transform(geometry._geometry);
        var transformed = geom.Geometry.from_(_geometry);
        transformed.projection = to;
        return transformed;    
    },
    
    /** api: property[id]
     *  ``String``
     *  The coordinate reference system identifier.
     */
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
    
    /** api: property[wkt]
     *  ``String``
     *  The well-known text representation of the coordinate reference system.
     */
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
    
    /** private: property[config]
     */
    get config() {
        return {
            type: this.constructor.name,
            id: this.id
        };
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this projection.
     */
    get json() {
        return JSON.encode(this.config);
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

/** api: example
 *  Sample code to create a new projection object:
 * 
 *  .. code-block:: javascript
 *
 *      js> var wgs84 = new proj.Projection("EPSG:4326")
 *      js> wgs84
 *      <Projection EPSG:4326>
 *      js> wgs84.wkt
 *      GEOGCS["WGS 84", 
 *        DATUM["World Geodetic System 1984", 
 *          SPHEROID["WGS 84", 6378137.0, 298.257223563, AUTHORITY["EPSG","7030"]], 
 *          AUTHORITY["EPSG","6326"]], 
 *        PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], 
 *        UNIT["degree", 0.017453292519943295], 
 *        AXIS["Geodetic longitude", EAST], 
 *        AXIS["Geodetic latitude", NORTH], 
 *        AUTHORITY["EPSG","4326"]]
 */

exports.Projection = Projection;
