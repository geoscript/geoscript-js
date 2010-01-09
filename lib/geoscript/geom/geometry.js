var GEOM = require("../geom");
var UTIL = require("../util");
var PROJ = require("../proj");
var NUTIL = require("util");

var jts = Packages.com.vividsolutions.jts;

var wktWriter = new jts.io.WKTWriter();

_prepConfig = function(config) {
    if (!config) {
        config = {};
    } else if (config instanceof Array) {
        config = {coordinates: config};
    }
    return config;
};


/** api: (geom.Geometry) */

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
     *  reference system.  Use :meth:`proj.transform` to transform a geometry
     *  from one coordinate reference system to another.
     */
    get projection() {
        return this.cache.projection;
    },
    set projection(projection) {
        if (!(projection instanceof PROJ.Projection)) {
            projection = new PROJ.Projection(projection);
        }
        this.cache.projection = projection;
    },

    /** api: property[coordinates]
     *  ``Array``
     *  The geometry's coordinates array.
     */
    get coordinates() {
        return this._extractCoordinates(this._geometry);
    },
    
    /** private: method[extractCoordinates]
     *  :arg _geometry: ``com.vividsolutions.jts.geom.Geometry``
     *  :returns: ``Array`` An array of coordinates.
     *
     *  Generate an array of coordinates for the geometry.
     */
    _extractCoordinates: function(_geometry) {
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
    
    /** api: property[wkt]
     *  ``String``
     *  The Well-Known Text representation of the geometry.
     */
    get wkt() {
        var str;
        if (this._geometry) {
            str = String(wktWriter.write(this._geometry));
        } else {
            str = "undefined";
        }
        return str;
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
            caps = GEOM.BUFFER_CAP_ROUND;
        }
        
        return Geometry.from_(this._geometry.buffer(dist, segs, caps));
        
    },
    
    /** api: method[distance]
     *  :arg geometry: :class:`geom.Geometry`
     *  :returns: ``Number``
     *  
     *  Returns the minimum distance between this and the supplied geometry.
     */
    distance: function(geometry) {
        return this._geometry.distance(geometry._geometry);
    },
    
    /** api: property[area]
     *  ``Number``
     *  The geometry area.
     */
    get area() {
        return this._geometry.getArea();
    },

    /** api: property[length]
     *  ``Number``
     *  The geometry length.
     */
    get length() {
        return this._geometry.getLength();
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
        var g = this._geometry;
        return Geometry.from_(arguments.length ? g[method](arguments[0]._geometry) : g[method]());
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
        return this._geometry[method]();
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
        return this._geometry[method](g._geometry);
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
    var name = String(_geometry.getGeometryType());
    var Type = GEOM[name];
    var g;
    if (Type) {
        g = new Type();
        g._geometry = _geometry;
    }
    return g;
};

var _coordToArray = function(coordinate) {
    var list = [coordinate.x, coordinate.y];
    var z = coordinate.z;
    if (!isNaN(z)) {
        list.push(z);
    }
    return list;
};

var _arrayToCoord = function(list) {
    var z = (2 in list) ? list[2] : NaN;
    return new jts.geom.Coordinate(list[0], list[1], z);
};

exports.Geometry = Geometry;
exports._arrayToCoord = _arrayToCoord;
exports._coordToArray = _coordToArray;
exports._prepConfig = _prepConfig;
