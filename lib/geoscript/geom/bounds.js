var register = require("./util").register;
var Factory = require("../factory").Factory;
var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;
var PROJ = require("../proj");
var Polygon = require("./polygon").Polygon;
var Geometry = require("./geometry").Geometry;

var ReferencedEnvelope = Packages.org.geotools.geometry.jts.ReferencedEnvelope;
var Envelope = Packages.com.vividsolutions.jts.geom.Envelope;

var sameProjection = function(source, other) {
    if (source.projection && other.projection && !source.projection.equals(other.projection)) {
        other = other.transform(source.projection);
    }
    return other;
};

/** api: (define)
 *  module = geom
 *  class = Bounds
 */

var Bounds = UTIL.extend(GeoObject, {
    
    /** api: constructor
     *  .. class:: Bounds
     *
     *      Create a new bounds given minx, miny, maxx, maxy, and an optional
     *      projection.
     */
    constructor: function Bounds(config) {
        if (config) {
            if (UTIL.isArray(config)) {
                config = {
                    minx: config[0], miny: config[1], 
                    maxx: config[2], maxy: config[3]                    
                };
            }
            var projection = config.projection;
            var isEmpty = (
                (typeof config.minx !== "number") || (typeof config.maxx !== "number") ||
                (typeof config.miny !== "number") || (typeof config.maxy !== "number") ||
                (config.maxx < config.minx) || (config.maxy < config.miny)
            );
            if (projection) {
                if (!(projection instanceof PROJ.Projection)) {
                    projection = new PROJ.Projection(projection);
                }
                var _projection = projection._projection;
                if (!isEmpty) {
                    this._bounds = new ReferencedEnvelope(
                        config.minx, config.maxx, config.miny, config.maxy, _projection
                    );                
                } else {
                    this._bounds = new ReferencedEnvelope(_projection);
                }
            } else {
                if (!isEmpty) {
                    this._bounds = new ReferencedEnvelope(
                        config.minx, config.maxx, config.miny, config.maxy, null
                    );                
                } else {
                    this._bounds = new ReferencedEnvelope();
                }
            }
        }
    },
    
    /** private: property[config]
     *  ``Object``
     */
    get config() {
        return {
            type: this.constructor.name,
            minx: this.minx,
            miny: this.miny,
            maxx: this.maxx,
            maxy: this.maxy,
            projection: this.projection && this.projection.id
        };
    },
    
    /** api: method[toArray]
     *  :returns: ``Array``
     *
     *  Return an array containing [minx, miny, maxx, maxy] values for this
     *  bounds.
     */
    toArray: function() {
        return [this.minx, this.miny, this.maxx, this.maxy];
    },
    
    /** api: property[minx]
     *  ``Number``
     *  The minimum value in the first (x) dimension for this bounds.
     */
    get minx() {
        return Number(this._bounds.getMinX());
    },
    
    /** api: property[miny]
     *  ``Number``
     *  The minimum value in the second (y) dimension for this bounds.
     */
    get miny() {
        return Number(this._bounds.getMinY());
    },
    
    /** api: property[maxx]
     *  ``Number``
     *  The maximum value in the first (x) dimension for this bounds.
     */
    get maxx() {
        return Number(this._bounds.getMaxX());
    },
    
    /** api: property[maxy]
     *  ``Number``
     *  The maximum value in the second (y) dimension for this bounds.
     */
    get maxy() {
        return Number(this._bounds.getMaxY());
    },
    
    /** api: property[area]
     *  ``Number``
     *  The are of this bounds.
     */
    get area() {
        return Number(this._bounds.getArea());
    },
    
    /** api: property[height]
     *  ``Number``
     *  The difference between the maximum and minimum y values.
     */
    get height() {
        return Number(this._bounds.getHeight());
    },
    
    /** api: property[height]
     *  ``Number``
     *  The difference between the maximum and minimum x values.
     */
    get width() {
        return Number(this._bounds.getWidth());
    },
    
    /** api: property[projection]
     *  :class:`proj.Projection`
     *  The coordinate reference system for the bounds (if specified).  Setting
     *  this value will not transform coordinates of the bounds.  To transform
     *  a bounds from one projection to another, use the :meth:`transform`
     *  method.
     */
    get projection() {
        var projection = null;
        var _projection = this._bounds.getCoordinateReferenceSystem();
        if (_projection) {
            projection = PROJ.Projection.from_(_projection);
        }
        return projection;
    },
    set projection(projection) {
        if (!(projection instanceof PROJ.Projection)) {
            projection = new PROJ.Projection(projection);
        }
        this._bounds = new ReferencedEnvelope(
            this.minx, this.maxx, this.miny, this.maxy, projection._projection
        );
    },
    
    /** private: method[quadGenerator]
     *  :arg level: ``Number``
     *  :returns: ``Generator``
     *
     *  Returns a generator of bounds objects for stepping through nodes in a
     *  tree of quads based on this bounds.  Level 0 is the current bounds.
     *  Level 1 is the four quadrants of current bounds.  Level 2 is the 16
     *  quadrants of the four level 1 quadrants.  Etc.
     */
    quadGenerator: function(level) {
        if (level === undefined) {
            level = 1;
        }
        var projection = this.projection;
        var factor = Math.pow(2, level);
        var dx = (this.maxx - this.minx) / factor;
        var dy = (this.maxy - this.miny) / factor;
        for (var minx=this.minx, i=0; i<factor; minx+=dx,++i) {
            for (var miny=this.miny, j=0; j<factor; miny+=dy,++j) {
                yield new Bounds({
                    minx: minx, miny: miny, 
                    maxx: minx + dx, maxy: miny + dy, 
                    projection: projection
                });
            }
        }
    },
    
    /** private: method[quadTreeGenerator]
     *  :arg start: ``Number`` Starting level
     *  :arg stop: ``Number`` Stopping level (non-inclusive)
     *  :returns: ``Generator``
     *
     *  Returns a generator of bounds objects for stepping through nodes in a
     *  tree of quads based on this bounds.  Level 0 is the current bounds.
     *  Level 1 is the four quadrants of current bounds.  Level 2 is the 16
     *  quadrants of the four level 1 quadrants.  Etc.
     */
    quadTreeGenerator: function(start, stop) {
        start = start || 0;
        if (stop === undefined) {
            stop = Infinity;
        }
        for (var i=start; i<stop; ++i) {
            for (var bounds in Iterator(this.quadGenerator(i))) {
                yield bounds;
            }
        }
    },
    
    /** api: method[quadTree]
     *  :arg start: ``Number`` Starting level
     *  :arg stop: ``Number`` Stopping level (non-inclusive)
     *  :returns: ``Iterator``
     *
     *  Returns an iterator of bounds objects for stepping through nodes in a
     *  tree of quads based on this bounds.  Level 0 is the current bounds.
     *  Level 1 is the four quadrants of current bounds.  Level 2 is the 16
     *  quadrants of the four level 1 quadrants.  Etc.
     */
    quadTree: function(start, stop) {
        return Iterator(this.quadTreeGenerator(start, stop));
    },
    
    /** api: method[transform]
     *  :arg projection: :class:`proj.Projection`
     *  :returns: :class:`geom.Bounds`
     *
     *  Generate the bounds of the geometry that results from transforming this
     *  bounds to another projection.  This bounds must have a :attr:`projection`
     *  set before calling this method.
     */
    transform: function(projection) {
        if (!this.projection) {
            throw "Bounds must have a projection set before it can be transformed.";
        }
        if (!(projection instanceof PROJ.Projection)) {
            projection = new PROJ.Projection(projection);
        }
        var _bounds = this._bounds.transform(projection._projection, true);
        return Bounds.from_(_bounds);
    },
    
    /** api: property[empty]
     *  ``Boolean``
     *  Empty bounds have zero width and height.
     */
    get empty() {
        return Boolean(this._bounds.isEmpty());
    },
    
    /** api: method[equals]
     *  :arg other: :class:`geom.Bounds`
     *  :returns: ``Boolean``
     *
     *  Determine if two bounds are equivalent.
     */
    equals: function(other) {
        return Boolean(this._bounds.equals(other._bounds));
    },
    
    /** api: method[contains]
     *  :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Determine if the given point or geometry lies in the interior or on the 
     *  boundary of this bounds.
     */
    contains: function(other) {
        if (other instanceof Geometry) {
            other = other.bounds;
        }
        other = sameProjection(this, other);
        var _env = new Envelope(other.minx, other.maxx, other.miny, other.maxy);
        return this._bounds.contains(_env);
    },
    
    /** api: method[include]
     *  :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
     *  :returns: :class:`Bounds` This bounds.
     *
     *  Extends this bounds as necessary to include the given bounds or geometry.
     *  Modifies this bounds.
     */
    include: function(other) {
        if (other.projection && this.projection && !this.projection.equals(other.projection)) {
            throw "Include requires both objects have the same projection";
        }
        if (other instanceof Geometry) {
            other = other.bounds;
        }
        this._bounds.expandToInclude(other._bounds);
        return this;
    },
    
    /** api: method[intersects]
     *  :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
     *  :returns: ``Boolean``
     *
     *  Determine if the interiors or edges of two bounds intersect.  If a 
     *  geometry is given, intersection will be determined as if this bounds 
     *  were a polygon.
     */
    intersects: function(other) {
        var intersects = false;
        if (other instanceof Geometry) {
            intersects = other.intersects(this.toPolygon());
        } else {
            other = sameProjection(this, other);
            var _env = new Envelope(other.minx, other.maxx, other.miny, other.maxy);
            intersects = Boolean(this._bounds.intersects(_env));
        }
        return intersects;
    },
    
    /** api: method[intersection]
     *  :arg other: :class:`geom.Bounds`
     *  :returns: :class:`geom.Bounds`
     *
     *  Generate a bounds that is the intersection of this bounds with the given
     *  bounds.
     */
    intersection: function(other) {
        other = sameProjection(this, other);
        var _env = this._bounds.intersection(other._bounds);
        var _bounds = new ReferencedEnvelope(
            _env.getMinX(), _env.getMaxX(),
            _env.getMinY(), _env.getMaxY(),
            this.projection && this.projection._projection
        );
        if (_env.isNull()) {
            _bounds.setToNull();
        }
        return Bounds.from_(_bounds);
    },
    
    /** api: method[toPolygon]
     *  :returns: :class:`geom.Polygon`
     *
     *  Generate a polygon with the corner coordinates of this bounds.
     */
    toPolygon: function() {
        var polygon = new Polygon([
            [[this.minx, this.miny], [this.minx, this.maxy], [this.maxx, this.maxy], [this.maxx, this.miny]]
        ]);
        if (this.projection) {
            polygon.projection = this.projection;
        }
        return polygon;
    },

    /** api: method[clone]
     *  :returns: :class:`geom.Bounds`
     *
     *  Generate a copy of this bounds.
     */
    clone: function() {
        return new Bounds({
            minx: this.minx, miny: this.miny,
            maxx: this.maxx, maxy: this.maxy,
            projection: this.projection
        });
    },
    
    /** private: method[toFullString]
     *  :returns: ``String``
     */
    toFullString: function() {
        var bbox = [this.minx, this.miny, this.maxx, this.maxy].join(", ");
        var str = "[" + bbox + "]";
        var projection = this.projection;
        if (projection) {
            str += " " + projection.id;
        }
        return str;
    }
    
});

/** api: staticmethod[fromArray]
 *  :arg bbox: ``Array``
 *  :arg projection: ``proj.Projection`` Optional projection for the bounds.
 *  :returns: :class:`geom.Bounds`
 *
 *  Create a bounds given an array of [minx, miny, maxx, maxy] values.
 */
Bounds.fromArray = function(bbox, projection) {
    return new Bounds({
        minx: bbox[0], 
        miny: bbox[1], 
        maxx: bbox[2], 
        maxy: bbox[3],
        projection: projection
    });
};

Bounds.from_ = function(_bounds) {
    var bounds;
    if (_bounds instanceof ReferencedEnvelope) {
        bounds = new Bounds();
        bounds._bounds = _bounds;
    } else {
        bounds = new Bounds({
            minx: _bounds.getMinX(), miny: _bounds.getMinY(),
            maxx: _bounds.getMaxX(), maxy: _bounds.getMaxY()
        });
    }
    return bounds;
};


Bounds.ALL = Bounds.from_(ReferencedEnvelope.EVERYTHING);


/** api: example
 *  Sample code to create a new bounds:
 * 
 *  .. code-block:: javascript
 *
 *      js> var bounds = new GEOM.Bounds({
 *        >     minx: -180, maxx: 180, miny: -90, maxy: 90
 *        > });
 *      js> bounds.width
 *      360
 *      js> bounds.height
 *      180
 *      
 *  Sample code to create a new bounds with a projection:
 * 
 *  .. code-block:: javascript
 *  
 *      js> var bounds = new GEOM.Bounds({
 *        >     minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
 *        > });
 *      js> bounds.projection
 *      <Projection EPSG:4326>
 *      
 *  Sample code to create a new bounds from an array of [minx, miny, maxx, maxy] values:
 * 
 *  .. code-block:: javascript
 *  
 *      js> var bounds = GEOM.Bounds.fromArray([-180, -90, 180, 90]);
 */

exports.Bounds = Bounds;

// register a bounds factory for the module
register(new Factory(Bounds, {
    handles: function(config) {
        var capable = (
            typeof config.minx === "number"
        ) && (
            typeof config.maxx === "number"
        ) && (
            typeof config.miny === "number"
        ) && (
            typeof config.maxy === "number"
        );
        return capable;
    }
}));
