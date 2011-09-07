var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Symbolizer = require("./symbolizer").Symbolizer;
var Expression = require("../filter").Expression;
var Fill = require("./fill").Fill;
var Stroke = require("./stroke").Stroke;

var SLD = Packages.org.geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Shape
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Shape = exports.Shape = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Shape
     *
     *      A symbolizer that renders points using a named shape.
     */
    constructor: function Shape(config) {
        if (config) {
            if (typeof config === "string") {
                config = {name: config};
            }
        }
        Symbolizer.prototype.constructor.apply(this, [config]);
        // TODO: determine why this isn't the default
        if (!config || !("size" in config)) {
            this.size = 6;
        }
    },

    get _symbolizer() {
        if (!("_symbolizer" in this.cache)) {
            this._symbolizer = STYLE_UTIL._builder.createPointSymbolizer();
        }
        return this.cache._symbolizer;
    },
    set _symbolizer(_symbolizer) {
        this.cache._symbolizer = _symbolizer;
    },

    get _mark() {
        return SLD.mark(this._symbolizer);
    },
    get _graphic() {
        return SLD.graphic(this._symbolizer);
    },

    /** api: config[name]
     *  ``String``
     *  The shape name.  Acceptable values include "circle", "square",
     *  "triangle", "star", "cross", and "x".  Default is "square".
     */
    /** api: property[name]
     *  ``String``
     *  The shape name.
     */
    set name(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(expression);
        } else if (!(expression instanceof Expression)) {
            expression = new Expression(expression);
        }
        this._mark.setWellKnownName(expression._expression);
    },
    get name() {
        return Expression.from_(this._mark.getWellKnownName());
    },
    
    /** api: config[size]
     *  ``Number``
     *  The shape pixel size.  Default is 6.
     */
    /** api: property[size]
     *  :class:`filter.Expression`
     *  The shape pixel size.
     */
    set size(expression) {
        if (!(expression instanceof Expression)) {
            expression = new Expression(expression);
        }
        this._graphic.setSize(expression._expression);
    },
    get size() {
        return Expression.from_(this._graphic.getSize());
    },

    /** api: property[opacity]
     *  ``Number``
     *  The opacity value (0 - 1).  Default is ``1``.
     */
    set opacity(expression) {
        if (typeof expression === "number") {
            if (expression < 0 || expression > 1) {
                throw new Error("Opacity must be a number between 0 and 1 (inclusive)");
            }
            expression = Expression.literal(expression);
        } else if (typeof expression !== "object") {
            throw new Error("Shape opacity cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Shape opacity must be a number or an expression");
            }
        }
        this._graphic.setOpacity(expression._expression);
    },
    get opacity() {
        return Expression.from_(this._graphic.getOpacity());
    },

    /** api: config[rotation]
     *  ``Number``
     *  Rotation angle in degrees clockwise about the center point of the 
     *  shape.
     */
    set rotation(expression) {
        if (typeof expression === "number") {
            expression = Expression.literal(expression);
        } else if (typeof expression !== "object") {
            throw new Error("Shape rotation cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Shape rotation must be a number or an expression");
            }
        }
        this._graphic.setRotation(expression._expression);
    },
    /** api: property[rotation]
     *  ``Number``
     *  Rotation angle in degrees clockwise about the center point of the 
     *  shape.
     */
    get rotation() {
        return Expression.from_(this._graphic.getRotation());
    },
    
    /** api: config[fill]
     *  :class:`style.Fill`
     *  The fill used for this shape.  May be provided as a fill instance or
     *  any valid fill configuration.
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> var shape = new Shape({name: "circle", fill: "blue"});
     */
    set fill(fill) {
        if (!(fill instanceof Fill)) {
            fill = new Fill(fill);
        }
        this._mark.setFill(fill._fill);
    },
    /** api: property[fill]
     *  :class:`style.Fill`
     *  The fill used for this shape.
     */
    get fill() {
        return Fill.from_(this._mark.getFill());
    },

    /** api: config[stroke]
     *  :class:`style.Stroke`
     *  The stroke used for this shape.  May be provided as a stroke instance or
     *  any valid stroke configuration.
     *
     *  Example use:
     *
     *  .. code-block:: javascript
     *
     *      js> var shape = new Shape({name: "circle", stroke: "red"});
     */
    set stroke(stroke) {
        if (!(stroke instanceof Stroke)) {
            stroke = new Stroke(stroke);
        }
        this._mark.setStroke(stroke._stroke);
    },
    /** api: property[stroke]
     *  :class:`style.Stroke`
     *  The stroke used for this shape.
     */
    get stroke() {
        return Stroke.from_(this._mark.getStroke());
    },

    get config() {
        return {
            type: "Shape",
            name: this.name.config,
            size: this.size.config,
            opacity: this.opacity.config,
            rotation: this.rotation.config,
            fill: this.fill.config,
            stroke: this.stroke.config
        };
    },

    clone: function() {
        return new Shape(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return [
            "name: " + this.name.text,
            "size: " + this.size.text
        ].join(", ");
    }

});

// register a shape factory for the module
STYLE_UTIL.register(new Factory(Shape));
