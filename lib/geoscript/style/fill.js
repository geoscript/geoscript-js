var Factory = require("../factory").Factory;
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
            if (typeof config === "string") {
                config = {brush: config};
            }
        }
        Symbolizer.prototype.constructor.apply(this, [config]);
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
            throw new Error("Fill opacity cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Fill opacity must be a number or an expression");
            }
        }
        this._fill.setOpacity(expression._expression);
    },
    get opacity() {
        return Expression.from_(this._fill.getOpacity());
    },

    /** api: config[brush]
     *  :class:`style.Brush`
     *  The brush used to create this fill.  This will typically be a 
     *  :class:`Color` and can be given by the string hex value.
     */
    /** api: property[brush]
     *  :class:`style.Brush`
     *  The brush used to create this fill.
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
    set _fill(_fill) {
        this._symbolizer.setFill(_fill);
    },
    
    clone: function() {
        return new Fill(this.config);
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

Fill.from_ = function(_fill) {
    var fill = new Fill();
    fill._fill = _fill;
    return fill;
};

/** api: example
 *  Sample code to create a fill:
 * 
 *  .. code-block:: javascript
 *
 *      js> var fill = new STYLE.Fill({
 *       >     brush: "red",
 *       >     opacity: 0.5
 *       > });
 *
 */

// register a fill factory
STYLE_UTIL.register(new Factory(Fill));
