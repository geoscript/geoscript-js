var GEOM_UTIL = require("./util");
var UTIL = require("../util");
var PROJ = require("../proj");
var NUTIL = require("util");

var jts = Packages.com.vividsolutions.jts;
var geotools = Packages.org.geotools;
var CRS = geotools.referencing.CRS;
var GeometryTX = geotools.geometry.jts.GeometryCoordinateSequenceTransformer;
var prepFactory = new jts.geom.prep.PreparedGeometryFactory();
var _getMethod = GEOM_UTIL._getMethod;
var _prepConfig = GEOM_UTIL._prepConfig;

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
var Geometry = UTIL.extend(Object, {
    
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
            if (!(projection instanceof PROJ.Projection)) {
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
        var from = this.projection;
        if (!from) {
            throw "Projection must be set before calling transform.";
        }
        if (!(to instanceof PROJ.Projection)) {
            to = new PROJ.Projection(to);
        }
        var gt = new GeometryTX();
        gt.mathTransform = CRS.findMathTransform(from._projection, to._projection);
        var _geometry = gt.transform(this._geometry);
        var transformed = Geometry.from_(_geometry);
        transformed.projection = to;
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
        return NUTIL.repr(this.coordinates);
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of the geometry (see http://geojson.org).
     */
    get json() {
        return JSON.encode(this.config);
    },
    
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

    /** api: method[buffer]
     *  :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
     *      zero.
     *  :arg segs: ``Number`` Integer number of quadrant segments for circular
     *      arcs.  Default is 8.
     *  :arg caps: ``Number`` One of :data:`BUFFER_CAP_ROUND`,
     *      :data:`BUFFER_CAP_BUTT`, or :data:`BUFFER_CAP_SQUARE`.  Default
     *      is :data:`BUFFER_CAP_ROUND`.
     *  :returns: :class:`geom.Geometry`
     *  
     *  Construct a goemetry that buffers this geometry by the given width.
     */
    buffer: function(dist, segs, caps) {
        if (segs === undefined) {
            segs = 8;
        } else {
            segs |= 0;
        }
        if (caps === undefined) {
            caps = GEOM_UTIL.BUFFER_CAP_ROUND;
        }
        var geometry = Geometry.from_(_getMethod(this._geometry, "buffer")(dist, segs, caps));
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
     *  Creates a full copy of this geometry.
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
    /** api: method[isEmpty]
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is empty.
     */
    "isEmpty",

    /** api: method[isRectangle]
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is a rectangle.
     */
    "isRectangle",

    /** api: method[isSimple]
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is simple.
     */
    "isSimple",

    /** api: method[isValid]
     *  :returns: ``Boolean``
     *
     *  Tests if this geometry is valid.
     */    
    "isValid"
];
unary.forEach(function(method) {
    Geometry.prototype[method] = function() {
        return Boolean(_getMethod(this._geometry, method)());
    };
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
