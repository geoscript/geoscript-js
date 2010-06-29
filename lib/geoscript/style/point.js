var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Symbolizer = require("./symbolizer").Symbolizer;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = PointSymbolizer
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var PointSymbolizer = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: PointSymbolizer
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a symbolizer for rendering features with point geometries.
     */
    constructor: function PointSymbolizer(config) {
        if (config) {
            this._symbolizer = STYLE_UTIL._builder.createPointSymbolizer();
            UTIL.apply(this, config);
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
    },
    
    /** api: config[shape]
     *  ``String``
     *  Shape name.  Allowed values include ``"square"``, ``"circle"``, 
     *  ``"triangle"``, ``"star"``, ``"cross"``, and ``"x"``.  Default is 
     *  ``"square"``.
     */
    set shape(name) {
        var mark = SLD.mark(this._symbolizer)
        mark.setWellKnownName(STYLE_UTIL._filterFactory.literal(name));
    },
    /** api: property[shape]
     *  ``String``
     *  Shape name.
     */
    get shape() {
        var name;
        var mark = SLD.mark(this._symbolizer)
        if (mark) {
            name = String(mark.getWellKnownName());
        }
        return name;
    },
    
    /** api: config[size]
     *  ``Number``
     *  Size of the symbolizer in pixels.
     */
    set size(num) {
        var graphic = SLD.graphic(this._symbolizer)
        graphic.setSize(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[size]
     *  ``Number``
     *  Size of the symbolizer in pixels.
     */
    get size() {
        var num;
        var graphic = SLD.graphic(this._symbolizer);
        if (graphic) {
            num = Number(graphic.getSize());
        }
        return num;
    },

    /** api: config[rotation]
     *  ``Number``
     *  Rotation angle in degrees clockwise about the center point of the 
     *  symbolizer.
     */
    set rotation(num) {
        var graphic = SLD.graphic(this._symbolizer)
        graphic.setRotation(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[rotation]
     *  ``Number``
     *  Rotation angle in degrees clockwise about the center point of the 
     *  symbolizer.
     */
    get rotation() {
        var graphic = SLD.graphic(this._symbolizer);
        return Number(graphic.getRotation());
    },

    /** api: config[fillColor]
     *  ``String``
     *  The fill color.  This may be a named CSS color (e.g. ``"chartreuse"``) 
     *  or a hexidecimal color value (e.g. ``"#7fff00"``).
     */
    set fillColor(color) {
        var hex = STYLE_UTIL.getHexColor(color);
        if (hex) {
            var fill = SLD.fill(this._symbolizer)
            fill.setColor(STYLE_UTIL._filterFactory.literal(hex));
        } else {
            throw new Error("Can't determine hex color from fillColor '" + color + "'.")
        }
    },
    /** api: property[fillColor]
     *  ``String``
     *  The fill color.
     */
    get fillColor() {
        var fill = SLD.fill(this._symbolizer);
        return String(fill.getColor());
    },

    /** api: config[fillOpacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    set fillOpacity(num) {
        var fill = SLD.fill(this._symbolizer)
        fill.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[fillOpacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    get fillOpacity() {
        var fill = SLD.fill(this._symbolizer);
        return Number(fill.getOpacity());
    },
    
    // TODO: external graphic

    /** private: property[config]
     */
    get config() {
        return {
            type: "PointSymbolizer",
            shape: this.shape,
            size: this.size,
            rotation: this.rotation,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            strokeOpacity: this.strokeOpacity,
            fillColor: this.fillColor,
            fillOpactiy: this.fillOpacity
        };
    }

});

/** api: example
 *  Sample code to new point symbolizer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var symbolizer = new STYLE.PointSymbolizer({
 *        >     shape: "circle",
 *        >     size: 15,
 *        >     strokeColor: "#ffcc33",
 *        >     fillColor: "#ccaa00",
 *        >     fillOpacity: 0.5
 *        > });
 */

exports.PointSymbolizer = PointSymbolizer;

// register a point symbolizer factory for the module
STYLE_UTIL.register(new Factory(PointSymbolizer, {
    handles: function(config) {
        return ((
            !("rules" in config) &&
            !("symbolizers" in config) &&
            !("filter" in config) &&
            !("minScaleDenominator" in config) &&
            !("maxScaleDenominator" in config)
        ) && (
            config.defaultSymbolizerType === "PointSymbolizer" ||
            "shape" in config ||
            "size" in config ||
            "rotation" in config
        ));
    }
}));
