var Factory = require("../factory").Factory;
var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Color = require("./color").Color;
var Symbolizer = require("./symbolizer").Symbolizer;
var Expression = require("../filter").Expression;

var SLD = Packages.org.geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Label
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Label = exports.Label = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Label
     *
     *      A symbolizer for labeling features.
     */
    constructor: function Label(config) {
        if (typeof config == "string") {
            config = {expression: config};
        }
        Symbolizer.prototype.constructor.apply(this, [config]);
    },

    get _symbolizer() {
        if (!("_symbolizer" in this.cache)) {
            var _symbolizer = STYLE_UTIL._builder.createTextSymbolizer();
            this._symbolizer = _symbolizer;
        }
        return this.cache._symbolizer;
    },
    set _symbolizer(_symbolizer) {
        this.cache._symbolizer = _symbolizer;
    },
    
    get _font() {
        return this._symbolizer.getFont();
    },
    set _font(_font) {
        this._symbolizer.setFont(_font);
    },

    /** api: config[expression]
     *  :class:`filter.Expression`
     */
    /** api: property[expression]
     *  :class:`filter.Expression`
     */
    set expression(expression) {
        if (typeof expression === "number") {
            expression = Expression.literal(expression);
        }
        if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Failed to create expression from: " + expression);
            }
        }
        this._symbolizer.setLabel(expression._expression);
    },
    get expression() {
        return Expression.from_(this._symbolizer.getLabel());
    },

    /** api: config[fontFamily]
     *  ``String``
     */
    /** api: property[fontFamily]
     *  ``String``
     */
    set fontFamily(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(expression);
        }
        this._font.setFontFamily(expression._expression);
    },
    get fontFamily() {
        // TODO: deal with multiple families
        var _family = this._font.getFamily().get(0);
        return Expression.from_(_family);
    },

    /** api: config[fontSize]
     *  ``Number``
     */
    /** api: property[fontSize]
     *  ``Number``
     */
    set fontSize(expression) {
        if (typeof expression === "number") {
            expression = Expression.literal(expression);
        }
        this._font.setSize(expression._expression);
    },
    get fontSize() {
        return Expression.from_(this._font.getSize());
    },

    /** api: config[fontStyle]
     *  ``String``
     */
    /** api: property[fontStyle]
     *  ``String``
     */
    set fontStyle(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(expression);
        }
        this._font.setStyle(expression._expression);
    },
    get fontStyle() {
        return Expression.from_(this._font.getStyle());
    },

    /** api: config[fontWeight]
     *  ``String``
     */
    /** api: property[fontWeight]
     *  ``String``
     */
    set fontWeight(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(expression);
        }
        this._font.setWeight(expression._expression);
    },
    get fontWeight() {
        return Expression.from_(this._font.getWeight());
    },

    clone: function() {
        return new Label(this.config);
    },

    get config() {
        return {
            type: "Label",
            expression: this.expression && this.expression.config,
            fontFamily: this.fontFamily.config,
            fontStyle: this.fontStyle.config,
            fontWeight: this.fontWeight.config
        };
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return [
            "expression: " + this.expression.text,
            "fontFamily: " + this.fontFamily.text,
            "fontStyle: " + this.fontStyle.text,
            "fontWeight: " + this.fontWeight.text
        ].join(", ");
    }

});

Label.from_ = function(_symbolizer) {
    var label = new Label();
    fill._symbolizer = _symbolizer;
    return label;
};

/** api: example
 *  Sample code to create a fill:
 * 
 *  .. code-block:: javascript
 *
 *      js> var label = new STYLE.Label({
 *       >     expression: "property"
 *       > });
 *
 */

// register a label factory
STYLE_UTIL.register(new Factory(Label));
