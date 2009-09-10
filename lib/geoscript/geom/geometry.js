var geom = require('geoscript/geom');

var jts = Packages.com.vividsolutions.jts;

var wktWriter = new jts.io.WKTWriter();
var wktReader = new jts.io.WKTReader();

/** api: (geom.Geometry) */

/** api: module = geom */

/** api: constructor
 *  .. class:: Geometry()
 *
 *      A Geometry instance should not be created directly.  
 *      Create an instance of a Geometry subclass instead.
 */
var Geometry = function() {
};
Geometry.prototype = {
    
    /** api: property[coordinates]
     *  ``Array``
     *  The geometry's coordinates array.
     */
    coordinates: undefined,
    
    /** api: method[toString]
     *  :returns: ``String``
     *  Generate the Well-Known Text representation of the geometry.
     */
    toString: function() {
        return this.toWKT();
    },
    
    /** api: method[toWKT]
     *  :returns: ``String``
     *
     *  Generate the Well-Known Text representation of the geometry.
     */
    toWKT: function() {
        return String(wktWriter.write(this._geometry));
    },    

    /** api: method[toJTS]
     *  :returns: ``jts.geom.Geometry``
     *
     *  Return the JTS geometry object.
     */
    toJTS: function() {
        return this._geometry;
    },
    
    /** api: method[buffer]
     *  :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
     *      zero.
     *  :arg segs: ``Number`` Integer number of quadrant segments for circular
     *      arcs.  Default is 8.
     *  :arg caps: ``Number`` One of Geometry.BUFFER_CAP_ROUND,
     *      Geometry.BUFFER_CAP_BUTT, or Geometry.BUFFER_CAP_SQUARE.  Default
     *      is Geometry.BUFFER_CAP_ROUND.
     *  :returns: :class:`Geometry`
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
            caps = Geometry.BUFFER_CAP_ROUND;
        }
        
        return Geometry.fromJTS(this._geometry.buffer(dist, segs, caps));
        
    },
    
    /** api: method[distance]
     *  :arg geometry: :class:`Geometry`
     *  :returns: ``Number``
     *  
     *  Returns the minimum distance between this and the supplied geometry.
     */
    distance: function(geometry) {
        return this._geometry.distance(geometry._geometry);
    },
    
    /** api: method[getArea]
     *  :returns: ``Number``
     *  The geometry area.
     */
    getArea: function() {
        return this._geometry.getArea();
    },

    /** api: method[getLength]
     *  :returns: ``Number``
     *  The geometry length.
     */
    getLength: function() {
        return this._geometry.getLength();
    },
    
    /** api: method[draw]
     *  Draw the geometry onto a frame.
     */
    draw: function(options) {
        options = options || {};
        var size = options.size || [500, 500];
        var buf = (buf in options) ? options.buf : 50;
        
        var awt = java.awt;
        var AffineTransform = java.awt.geom.AffineTransform;
        var swing = javax.swing;
        var LiteShape = Packages.org.geotools.geometry.jts.LiteShape;

        var e = this._geometry.getEnvelopeInternal();
        var scx = size[0] / e.width;
        var scy = size[1] / e.height;

        var tx = -1 * e.minX;
        var ty = -1 * e.minY;

        var at = new AffineTransform();

        // scale to size of canvas (inverting the y axis)
        at.scale(scx, -scy);

        // translate to the origin
        at.translate(tx, ty);

        // translate to account for invert
        at.translate(0, -size[1] / scy);

        // buffer
        at.translate(buf / scx, -buf / scy);

        var shp = LiteShape(this._geometry, at, false);

        var panel = new JavaAdapter(swing.JPanel, {
            paintComponent: function(g) {
                g.draw(shp);
            }
        })
        
        var s = new awt.Dimension(
            (size[0] + 2 * buf) | 0,
            (size[1] + 2 * buf) | 0
        );
        panel.setPreferredSize(s);
        var frame = new swing.JFrame();
        frame.contentPane = panel;
        frame.setSize(s);
        frame.visible = true;
        
    },

    /** private: property[_geometry]
     *  ``jts.geom.Geometry``
     */
    _geometry: undefined,

    /** private: property[_factory]
     *  ``jts.geom.GeometryFactory``
     *  A jts geometry factory.
     */
    _factory: new jts.geom.GeometryFactory()
    
};

var constructive = [
    "clone",
    "convexHull", 
    "difference", 
    "getBoundary", 
    "getEnvelope", 
    "intersection", 
    "symDifference",
    "union"
];
constructive.forEach(function(method) {
    Geometry.prototype[method] = function() {
        var g = this._geometry;
        return Geometry.fromJTS(arguments.length ? g[method](arguments[0]._geometry) : g[method]());
    };
});

var unary = [
    "isEmpty",
    "isRectangle",
    "isSimple",
    "isValid"
];
unary.forEach(function(method) {
    Geometry.prototype[method] = function() {
        return this._geometry[method]();
    };
});

var binary = [
    "contains",
    "coveredBy",
    "covers",
    "crosses",
    "disjoint",

    /** api: method[equals]
     *  :arg other: :class:`Geometry`
     *  :returns: ``Boolean``  This geometry equals the other geometry.
     *
     *  Geometries are considered equal if they share at least one point in
     *  common and if no point of either geometry lines in the exterior of the
     *  other.
     */
    "equals",

    "equalsExact",
    "overlaps",
    "touches",
    "within"
];
binary.forEach(function(method) {
    Geometry.prototype[method] = function(g) {
        return this._geometry[method](g._geometry);
    }
});

/** api: constant[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
Geometry.BUFFER_CAP_ROUND = jts.operation.buffer.BufferOp.CAP_ROUND;

/** api: constant[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
Geometry.BUFFER_CAP_SQUARE = jts.operation.buffer.BufferOp.CAP_SQUARE;

/** api: constant[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
Geometry.BUFFER_CAP_BUTT = jts.operation.buffer.BufferOp.CAP_BUTT;

/** api: staticmethod[fromWKT]
 *  :arg wkt: ``String`` The Well-Known Text representation of a geometry.
 *  :returns: :class:`Geometry`
 *
 *  Create a geometry from WKT.  The specific geometry type depends on the
 *  given WKT.
 */
Geometry.fromWKT = function(wkt) {
    var _geometry = wktReader.read(wkt);
    return Geometry.fromJTS(_geometry);
};

/** api: staticmethod[fromJTS]
 *  :arg geometry: ``jts.geom.Geometry`` A JTS geometry object.
 *  :arg options: ``Object`` Geometry options.
 *  :returns: :class`Geometry`
 *
 *  Create a geoscript geometry object from a JTS geometry object.
 */
Geometry.fromJTS = function(geometry, options) {
    var type = String(geometry.getGeometryType()),
        Constructor = geom[type],
        g, coords;
    if (Constructor) {
        coords = extractCoords(geometry);
        g = new Constructor(coords, options);
    }
    return g;
};

var extractCoords = function(geometry) {
    var coords = [],
        coordinates = geometry.getCoordinates();
    var type = String(geometry.getGeometryType());
    switch (type) {
        case "Point":
            coords = coordToArray(coordinates[0]);
            break;
        case "LineString":
        case "LinearRing":
            coordinates.forEach(function(c, i) {
                coords[i] = coordToArray(c);
            });
            break;
        case "Polygon":
            coords[0] = extractCoords(geometry.getExteriorRing());
            var numHoles = geometry.getNumInteriorRing();
            for(var i=0; i<numHoles; ++i) {
                coords[i+1] = extractCoords(geometry.getInteriorRingN(i));
            }
            break;
    }
    return coords;
};

var coordToArray = function(coordinate) {
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