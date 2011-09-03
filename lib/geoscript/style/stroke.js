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

    /** api: property[brush]
     *  ``Brush``
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

    /** api: property[width]
     *  ``Number``
     *  The pixel width of the stroke.  Default is ``1``.
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
        } else if (!(expression instanceof Expression)) {
            throw new Error("Color opacity must be a number or an expression");
        }
        this._stroke.setOpacity(expression._expression);
    },
    get opacity() {
        return Expression.from_(this._stroke.getOpacity());
    },

    get _stroke() {
        return SLD.stroke(this._symbolizer);
    },
    
    get config() {
        return {
            type: "Stroke",
            brush: this.brush && this.brush.config,
            opacity: this.opacity.config,
            width: this.width.config
        };
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

