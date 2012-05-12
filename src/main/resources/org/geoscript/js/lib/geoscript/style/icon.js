var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Symbolizer = require("./symbolizer").Symbolizer;
var Expression = require("../filter").Expression;

var SLD = Packages.org.geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Icon
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Icon = exports.Icon = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Icon
     *
     *      A symbolizer that renders points using a graphic image.
     */
    constructor: function Icon(config) {
        if (config) {
            if (typeof config === "string") {
                config = {url: config};
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

    get _graphic() {
        return SLD.graphic(this._symbolizer);
    },
    
    get _graphicalSymbol() {
        return this._graphic.graphicalSymbols().get(0);
    },
    set _graphicalSymbol(_graphicalSymbol) {
        var _graphicalSymbols = this._graphic.graphicalSymbols();
        _graphicalSymbols.clear();
        _graphicalSymbols.add(_graphicalSymbol);
    },


    /** api: config[url]
     *  ``String``
     *  The icon url.
     */
    /** api: property[url]
     *  ``String``
     *  The icon url.
     */
    set url(url) {
        this._graphicalSymbol = STYLE_UTIL._builder.createExternalGraphic(
            UTIL.toURL(url), "image/" + UTIL.getImageType(url)
        );
    },
    get url() {
        return String(this._graphicalSymbol.getLocation());
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
            throw new Error("Icon opacity cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Icon opacity must be a number or an expression");
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
            throw new Error("Icon rotation cannot be type: " + (typeof expression));
        } else if (!(expression instanceof Expression)) {
            try {
                expression = new Expression(expression);
            } catch (err) {
                throw new Error("Icon rotation must be a number or an expression");
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
    
    get config() {
        return {
            type: "Icon",
            name: this.url,
            size: this.size.config,
            opacity: this.opacity.config,
            rotation: this.rotation.config
        };
    },

    clone: function() {
        return new Icon(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return [
            "url: " + this.url,
            "size: " + this.size.text
        ].join(", ");
    }

});

// register a shape factory for the module
STYLE_UTIL.register(new Factory(Icon));
