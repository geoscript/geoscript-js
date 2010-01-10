var UTIL = require("../util");
var PROJ = require("../proj");
var Polygon = require("./polygon").Polygon;

var ReferencedEnvelope = Packages.org.geotools.geometry.jts.ReferencedEnvelope;


/** api: (define)
 *  module = geom
 *  class = Bounds
 */

var Bounds = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Bounds
     *
     *      Create a new bounds given minx, miny, maxx, maxy, and an optional
     *      projection.
     */
    constructor: function Bounds(config) {  
        if (config) {
            var projection = config.projection;
            var _projection = null;
            if (projection) {
                if (!(projection instanceof PROJ.Projection)) {
                    projection = new PROJ.Projection(projection);
                }
                _projection = projection._projection;
            }
            this._bounds = new ReferencedEnvelope(
                config.minx, config.maxx, config.miny, config.maxy, _projection
            );            
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
        }
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this bounds.
     */
    get json() {
        return JSON.encode(this.config);
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
    
    /** private: property[empty]
     *  ``Boolean``
     *  This bounds is empty.
     *  TODO: confirm this is legit.
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
    
    /** api: method[intersects]
     *  :arg other: :class:`geom.Bounds`
     *  :returns: ``Boolean``
     *
     *  Determine if two bounds intersect.
     */
    intersects: function(other) {
        return Boolean(this._bounds.intersects(other._bounds));
    },
    
    /** api: method[intersection]
     *  :arg other: :class:`geom.Bounds`
     *  :returns: :class:`geom.Bounds`
     *
     *  Generate a bounds that is the intersection of this bounds with the given
     *  bounds.
     */
    intersection: function(other) {
        return Bounds.from_(this._bounds.intersection(other._bounds));
    },
    
    /** api: method[toPolygon]
     *  :returns: :class:`geom.Polygon`
     *
     *  Generate a polygon with the corner coordinates of this bounds.
     */
    toPolygon: function() {
        return new Polygon([
            [[this.minx, this.miny], [this.minx, this.maxy], [this.maxx, this.maxy], [this.maxx, this.miny]]
        ]);
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
 *  :returns: :class`geom.Bounds`
 *
 *  Create a bounds given an array of [minx, miny, maxx, maxy] values.
 */
Bounds.fromArray = function(bbox) {
    return new Bounds({minx: bbox[0], miny: bbox[1], maxx: bbox[2], maxy: bbox[3]});
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

exports.Bounds = Bounds;

// register a bounds factory for the module
var GEOM = require("../geom");
var Factory = require("../factory").Factory;

GEOM.register(new Factory(Bounds, {
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
