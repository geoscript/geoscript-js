var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Brush = require("./brush").Brush;
var Color = require("./color").Color;
var Symbolizer = require("./symbolizer").Symbolizer;
var Expression = require("../filter").Expression;

var SLD = Packages.org.geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Fill
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Fill = exports.Fill = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Fill
     *
     *      A symbolizer for filling polygon geometries.
     */
    constructor: function Fill(config) {
        if (config) {
            if (typeof config.brush === "string") {
                config.brush = new Color(config.brush);
            }
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
    },

    get _symbolizer() {
        if (!("_symbolizer" in this.cache)) {
            var _symbolizer = STYLE_UTIL._builder.createPolygonSymbolizer();
            var _stroke = SLD.stroke(_symbolizer);
            _stroke.setWidth(Expression.literal(0)._expression);
            this._symbolizer = _symbolizer;
        }
        return this.cache._symbolizer;
    },
    set _symbolizer(_symbolizer) {
        this.cache._symbolizer = _symbolizer;
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
        this._fill.setOpacity(expression._expression);
    },
    get opacity() {
        return Expression.from_(this._fill.getOpacity());
    },

    /** api: property[brush]
     *  ``Brush``
     */
    set brush(brush) {
        if (!(brush instanceof Brush)) {
            brush = STYLE_UTIL.create(brush);
        }
        if (brush instanceof Color) {
            this._fill.setColor(brush._expression);
        }
    },
    get brush() {
        var brush;
        var _expression = this._fill.getColor();
        if (_expression) {
            brush = Color.from_(_expression);
        }
        return brush;
    },

    get _fill() {
        return SLD.fill(this._symbolizer);
    },

    get config() {
        return {
            type: "Fill",
            brush: this.brush && this.brush.config,
            opacity: this.opacity.config
        };
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return [
            "opacity: " + this.opacity.text,
            "brush: " + this.brush
        ].join(", ");
    }

});

