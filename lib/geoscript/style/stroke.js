var Factory = require("../factory").Factory;
var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Brush = require("./brush").Brush;
var Symbolizer = require("./symbolizer").Symbolizer;
var Color = require("./color").Color;
var Expression = require("../filter").Expression;

var SLD = Packages.org.geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Stroke
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Stroke = exports.Stroke = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Stroke
     *
     *      A symbolizer for stroking geometries.
     */
    constructor: function Stroke(config) {
        if (config) {
            if (typeof config === "string") {
                config = {brush: config};
            }
        }
        Symbolizer.prototype.constructor.apply(this, [config]);
    },
    
    get _symbolizer() {
        if (!("_symbolizer" in this.cache)) {
            this._symbolizer = STYLE_UTIL._builder.createLineSymbolizer();
        }
        return this.cache._symbolizer;
    },
    set _symbolizer(_symbolizer) {
        this.cache._symbolizer = _symbolizer;
    },

    /** api: config[brush]
     *  :class:`style.Brush`
     *  The brush used to create this stroke.  This will typically be a 
     *  :class:`Color` and can be given by the string hex value.
     */
    /** api: property[brush]
     *  :class:`style.Brush`
     *  The brush used to create this stroke.
     */
    set brush(brush) {
        if (!(brush instanceof Brush)) {
            brush = STYLE_UTIL.create(brush);
        }
        if (brush instanceof Color) {
            this._stroke.setColor(brush._expression);
        }
    },
    get brush() {
        var brush;
        var _expression = this._stroke.getColor();
        if (_expression) {
            brush = Color.from_(_expression);
        }
        return brush;
    },

    /** api: config[width]
     *  ``Number``
     *  The pixel width of the stroke.  Default is ``1``.
     */
    /** api: property[width]
     *  ``Number``
     *  The pixel width of the stroke.
     */
    set width(expression) {
        if (!(expression instanceof Expression)) {
            expression = new Expression(expression);
        }
        this._stroke.setWidth(expression._expression);
    },
    get width() {
        return Expression.from_(this._stroke.getWidth());
    },
    
    /** api: config[opacity]
     *  ``Number``
     *  The opacity value (``0`` - ``1``).  Default is ``1``.
     */
    /** api: property[opacity]
     *  ``Number``
     *  The opacity value.
     */
    set opacity(expression) {
        if (typeof expression === "number") {
            if (expression < 0 || expression > 1) {
                throw new Error("Opacity must be a number between 0 and 1 (inclusive)");
            }
            expression = Expression.literal(expression);
        } else if (typeof expression !== "object") {
            throw new Error("Stroke opacity cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Stroke opacity must be a number or an expression");
            }
        }
        this._stroke.setOpacity(expression._expression);
    },
    get opacity() {
        return Expression.from_(this._stroke.getOpacity());
    },

    get _stroke() {
        return SLD.stroke(this._symbolizer);
    },    
    set _stroke(_stroke) {
        this._symbolizer.setStroke(_stroke);
    },

    get config() {
        return {
            type: "Stroke",
            brush: this.brush && this.brush.config,
            opacity: this.opacity.config,
            width: this.width.config
        };
    },

    clone: function() {
        return new Stroke(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return [
            "width: " + this.width.text,
            "opacity: " + this.opacity.text,
            "brush: " + this.brush
        ].join(", ");
    }

});

Stroke.from_ = function(_stroke) {
    var stroke = new Stroke();
    stroke._stroke = _stroke;
    return stroke;
};

// register a stroke factory
STYLE_UTIL.register(new Factory(Stroke));

