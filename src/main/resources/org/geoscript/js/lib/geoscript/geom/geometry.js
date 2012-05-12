var GEOM_UTIL = require("./util");
var UTIL = require("../util");
var PROJ = require("../proj");
var GeoObject = require("../object").GeoObject;

var jts = Packages.com.vividsolutions.jts;
var BufferParameters = jts.operation.buffer.BufferParameters;
var BufferOp = jts.operation.buffer.BufferOp;
var Simplifier = jts.simplify.DouglasPeuckerSimplifier;
var geotools = Packages.org.geotools;
var CRS = geotools.referencing.CRS;
var GeometryTX = geotools.geometry.jts.GeometryCoordinateSequenceTransformer;
var prepFactory = new jts.geom.prep.PreparedGeometryFactory();
var AffineTransform = java.awt.geom.AffineTransform;
var JTS = geotools.geometry.jts.JTS;
var AffineTransform2D = geotools.referencing.operation.transform.AffineTransform2D;
var _getMethod = GEOM_UTIL._getMethod;
var _prepConfig = GEOM_UTIL._prepConfig;

var arrayRepr = function(array) {
    var str;
    if (array.map) {
        str = "[" + array.map(arrayRepr).join(", ") + "]";
    } else {
        str = array;
    }
    return str;
}

var sameProjection = function(source, other) {
    if (source.projection && other.projection && !source.projection.equals(other.projection)) {
        other = other.transform(source.projection);
    }
    return other;
};

/** api: (define)
 *  module = geom
 *  class = Geometry
 */
var Geometry = UTIL.extend(GeoObject, {
    
    /** private: property[_geometry]
     *  ``jts.geom.Geometry``
     */
    _geometry: undefined,
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,

    /** api: constructor
     *  .. class:: Geometry
     *
     *      A Geometry instance should not be created directly.  
     *      Create an instance of a Geometry subclass instead.
     */
    constructor: function Geometry(config) {
        this.cache = {};
        config = _prepConfig(config);
        if (config.coordinates) {
            this._geometry = this._create(config.coordinates);
        }
        if (config.projection) {
            this.projection = config.projection;
        }
    },
    
    /** private: method[_create]
     *  :arg coords: ``Array`` A coordinates array.
     *
     *  Create a JTS geometry from an array of coordinates.  Must be implemented
     *  by a subclass.
     */
    _create: function(coords) {
        throw new Error("Geometry subclass must implement _create.");
    },
    
    /** api: property[projection]
     *  :class:`proj.Projection`
     *  Optional projection for the geometry.  If this is set, it is assumed
     *  that the geometry coordinates are in the corresponding coordinate
     *  reference system.  Use the :meth:`transform` method to transform a 
     *  geometry from one coordinate reference system to another.
     */
    get projection() {
        return this.cache.projection;
    },
    set projection(projection) {
        if (projection) {
            if (typeof projection == "string") {
                projection = new PROJ.Projection(projection);
            }
            // clear anything else in the cache
            this.cache = {projection: projection};
        }
    },
    
    /** api: method[transform]
     *  :arg to: :class:`proj.Projection`
     *  :returns: :class:`geom.Geometry`
     *
     *  Transform coordinates of this geometry to the given projection.  The
     *  :attr:`projection` of this geometry must be set before calling this 
     *  method.  Returns a new geometry.
     */
    transform: function(to) {
        var transformed;
        if (typeof to === "string") {
            to = new PROJ.Projection(to);
        }
        if (to instanceof PROJ.Projection) {
            var from = this.projection;
            if (!from) {
                throw "Projection must be set before calling transform.";
            }
            var gt = new GeometryTX();
            gt.mathTransform = CRS.findMathTransform(from._projection, to._projection);
            var _geometry = gt.transform(this._geometry);
            transformed = Geometry.from_(_geometry);
            transformed.projection = to;
        } else {
            // affine transform
            to = UTIL.applyIf(to, {
                dx: 0, dy: 0,
                sx: 1, sy: 1,
                shx: 0, shy: 0,
                rotation: 0
            });
            var transform = new AffineTransform(to.sx, to.shy, to.shx, to.sy, to.dx, to.dy);
            transform.rotate(to.rotation);
            var _geometry = JTS.transform(this._geometry, new AffineTransform2D(transform));
            transformed = Geometry.from_(_geometry);
            transformed.projection = this.projection;
        }
        return transformed;    
    },
    
    /** api: method[prepare]
     *  :returns: :class:`geom.Geometry`
     *
     *  Prepare a geometry for multiple spatial operations.  Preparing optimizes
     *  the geometry for multiple calls to :meth:`contains`, :meth:`coveredBy`,
     *  :meth:`covers`, :meth:`crosses`, :meth:`disjoint`, :meth:`intersects`,
     *  :meth:`overlaps`, :meth:`touches`, and :meth:`within`.
     */
    prepare: function() {
        if (!this.prepared) {
            this._geometry = prepFactory.create(this._geometry);
        }
        return this;
    },
    
    /** api: property[prepared]
     *  ``Boolean``
     *  This is a prepared geometry.  See :meth:`prepare`.
     */
    get prepared() {
        return this._geometry instanceof jts.geom.prep.PreparedGeometry;
    },

    /** api: property[coordinates]
     *  ``Array``
     *  The geometry's coordinates array.
     */
    get coordinates() {
        return this._extractCoordinates(this._geometry);
    },
    
    /** api: property[bounds]
     *  :class:`geom.Bounds`
     *  The bounds defined by minimum and maximum x and y values in this geometry.
     */
    get bounds() {
        if (!this.cache.bounds) {
            var _bounds = _getMethod(this._geometry, "getEnvelopeInternal")();
            var bounds = GEOM_UTIL.create({
                type: "Bounds",
                minx: Number(_bounds.getMinX()), maxx: Number(_bounds.getMaxX()),
                miny: Number(_bounds.getMinY()), maxy: Number(_bounds.getMaxY()),
                projection: this.projection
            });
            this.cache.bounds = bounds;
        }
        return this.cache.bounds;
    },
    
    /** private: method[extractCoordinates]
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function() {
        throw new Error("Geometry subclasses must implement _extractCoordinates.");
    },

    /** private: method[toFullString]
     *  :returns: ``String``
     *  
     *  The Well-Known Text representation of the geometry.
     */
    toFullString: function() {
        return arrayRepr(this.coordinates);
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of the geometry (see http://geojson.org).
     */
    
    /** private: property[config]
     *  ``Object``
     */
    get config() {
        return {
            type: this.constructor.name,
            coordinates: this.coordinates
        };
    },
    
    /** api: property[centroid]
     *  ``geom.Point``
     *  The centroid of this geometry.
     */
    get centroid() {
        var _point = this._geometry.getCentroid();
        var point = Geometry.from_(_point);
        point.projection = this.projection;
        return point;
    },

    /** api: property[dimension]
     *  ``Number``
     *  The dimension of this geometry.
     */
    get dimension() {
        return this._geometry.getDimension();
    },

    /** api: method[buffer]
     *  :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
     *      zero.
     *  :arg options: ``Object`` Options for the buffer operation.
     *
     *  Options:
     *  * ``segs`` ``Number`` Integer number of quadrant segments for circular
     *      arcs.  Default is 8.
     *  * ``caps`` ``Number`` One of :data:`BUFFER_CAP_ROUND`,
     *      :data:`BUFFER_CAP_BUTT`, or :data:`BUFFER_CAP_SQUARE`.  Default
     *      is :data:`BUFFER_CAP_ROUND`.
     *  * ``single`` ``Boolean`` Create a single-sided buffer.  Default is 
     *      ``false``.
     *
     *  :returns: :class:`geom.Geometry`
     *  
     *  Construct a geometry that buffers this geometry by the given width.
     */
    buffer: function(dist, options) {
        options = options || {};
        var params = new BufferParameters();
        params.setSingleSided(!!options.single);
        params.setQuadrantSegments(options.segs || 8);
        params.setEndCapStyle(options.caps || GEOM_UTIL.BUFFER_CAP_ROUND);
        
        var _geometry = this._geometry;
        if (this.prepared) {
            _geometry = _geometry.getGeometry();
        }
        var geometry = Geometry.from_(BufferOp.bufferOp(_geometry, dist, params)); 
        geometry.projection = this.projection;
        return geometry;
    },
    
    /** api: method[simplify]
     *  :arg tolerance: ``Number`` The distance tolerance for the simplification. 
     *      All vertices in the simplified geometry will be within this distance
     *      of the original geometry. The tolerance value must be non-negative.
     *  :returns: :class:`geom.Geometry`
     *  
     *  Simplify the geometry using the standard Douglas-Peucker algorithm.
     *  Returns a new geometry.
     */
    simplify: function(tolerance) {
        tolerance = (tolerance > 0) ? tolerance : 0;
        var _geometry;
        try {
            _geometry = Simplifier.simplify(this._geometry, tolerance);
        } catch (err) {
            throw new Error("Unable to simplify geometry with tolerance: " + tolerance);
        }
        var geometry = Geometry.from_(_geometry);
        geometry.projection = this.projection;
        return geometry;
    },
    
    /** api: method[distance]
     *  :arg geometry: :class:`geom.Geometry`
     *  :returns: ``Number``
     *  
     *  Returns the minimum distance between this and the supplied geometry.
     */
    distance: function(geometry) {
        geometry = sameProjection(this, geometry);
        return _getMethod(this._geometry, "distance")(geometry._geometry);
    },
    
    /** api: property[area]
     *  ``Number``
     *  The geometry area.
     */
    get area() {
        return _getMethod(this._geometry, "getArea")();
    },

    /** api: property[length]
     *  ``Number``
     *  The geometry length.
     */
    get length() {
        return _getMethod(this._geometry, "getLength")();
    }
    
});

var constructive = [
    /** api: method[clone]
     *  :returns: :class:`geom.Geometry`
     *
     *  Creates a complete copy of this geometry.
     */
    "clone",

    /** api: method[convexHull]
     *  :returns: :class:`geom.Geometry`
     *  
     *  Computes the smallest convex :class:`Polygon` that contains this
     *  geometry.
     */
    "convexHull", 

    /** api: method[difference]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: :class:`geom.Geometry`
     *  
     *  Creates a geometry made up of all the points in this geometry that are
     *  not in the other geometry.
     */
    "difference", 

    /** api: method[getBoundary]
     *  :returns: :class:`geom.Geometry`
     *  
     *  Returns the boundary, or an empty geometry of appropriate dimension if
     *  this geometry is empty.
     */
    "getBoundary", 

    /** api: method[getEnvelope]
     *  :returns: :class:`geom.Geometry`
     *  
     *  Returns this geometry's bounding box.
     */
    "getEnvelope", 

    /** api: method[intersection]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: :class:`geom.Geometry`
     *  
     *  Creates a geometry representing all the points shared by this geometry
     *  and the other.
     */
    "intersection", 

    /** api: method[symDifference]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: :class:`geom.Geometry`
     *  
     *  Creates a geometry representing all the points in this geometry but not
     *  in the other plus all the points in the other but not in this geometry.
     */
    "symDifference",

    /** api: method[symDifference]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: :class:`geom.Geometry`
     *  
     *  Creates a geometry representing all the points in this geometry but not
     *  in the other plus all the points in the other but not in this geometry.
     */
    "union"
];
constructive.forEach(function(method) {
    Geometry.prototype[method] = function() {
        var _geometry;
        if (arguments.length) {
            _geometry = _getMethod(this._geometry, method)(sameProjection(this, arguments[0])._geometry);
        } else {
            _geometry = _getMethod(this._geometry, method)();            
        }
        var geometry = Geometry.from_(_geometry);
        geometry.projection = this.projection;
        return geometry;
    };
});

var unary = [
    /** api: property[empty]
     *  ``Boolean``
     *  The geometry is empty.
     */
    ["empty", "isEmpty"],

    /** api: property[rectangle]
     *  ``Boolean``
     *  This geometry is a rectangle.
     */
    ["rectangle", "isRectangle"],

    /** api: property[simple]
     *  ``Boolean``
     *  The geometry is simple.
     */
    ["simple", "isSimple"],

    /** api: property[valid]
     *  ``Boolean``
     *  The geometry is valid.
     */    
    ["valid", "isValid"]
];
unary.forEach(function(pair) {
    Object.defineProperty(Geometry.prototype, pair[0], {
        get: function() {
             return Boolean(_getMethod(this._geometry, pair[1])());
        },
        enumerable: true
    });
});

var binary = [
    /** api: method[contains]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry contains the other geometry (without boundaries
     *  touching).
     */
    "contains",

    /** api: method[coveredBy]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is covered by other geometry.
     */    
    "coveredBy",

    /** api: method[covers]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry covers the other geometry.
     */    
    "covers",

    /** api: method[crosses]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry crosses the other geometry.
     */
    "crosses",

    /** api: method[disjoint]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is disjoint to the other geometry.
     */
    "disjoint",

    /** api: method[equals]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Geometries are considered equal if they share at least one point in
     *  common and if no point of either geometry lies in the exterior of the
     *  other.
     */
    "equals",

    /** api: method[equalsExact]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is exactly equal to the other geometry.
     */
    "equalsExact",

    /** api: method[overlaps]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry overlaps the other geometry.
     */
    "overlaps",

    /** api: method[intersects]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry intersects the other geometry.
     */
    "intersects",

    /** api: method[touches]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry `only` touches the other geometry.
     */
    "touches",

    /** api: method[within]
     *  :arg other: :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is within the other geometry.  This is the
     *  inverse of :meth:`contains`.
     */
    "within"
];
binary.forEach(function(method) {
    Geometry.prototype[method] = function(g) {
        return Boolean(_getMethod(this._geometry, method)(sameProjection(this, g)._geometry));
    }
});

/** private: staticproperty[_factory]
 *  ``jts.geom.GeometryFactory``
 *  A jts geometry factory.
 */
Geometry._factory = new jts.geom.GeometryFactory();

/** private: staticmethod[from_]
 *  :arg geometry: ``jts.geom.Geometry`` A JTS geometry object.
 *  :returns: :class`Geometry`
 *
 *  Create a geoscript geometry object from a JTS geometry object.
 */
Geometry.from_ = function(_geometry) {
    var name = String(_getMethod(_geometry, "getGeometryType")());
    var g = GEOM_UTIL.create({type: name});
    g._geometry = _geometry;
    return g;
};

exports.Geometry = Geometry;
