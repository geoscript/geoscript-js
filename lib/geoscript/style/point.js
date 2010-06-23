var UTIL = require("../util");
var STYLE_UTIL = require("./util");
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
     *  Shape name.  This must be one of the SLD well-known graphic names.
     *  Default is ``"square"``.
     */
    /** api: property[shape]
     *  ``String``
     *  Shape name.
     */
    set shape(name) {
        var mark = SLD.mark(this._symbolizer)
        mark.setWellKnownName(STYLE_UTIL._filterFactory.literal(name));
    },
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
     *  Radius in pixels.
     */
    /** api: property[size]
     *  ``Number``
     *  Radius in pixels.
     */
    set size(num) {
        var graphic = SLD.graphic(this._symbolizer)
        graphic.setSize(STYLE_UTIL._filterFactory.literal(num));
    },
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
     *  Rotation angle in counter-clockwise radians.
     */
    /** api: property[rotation]
     *  ``Number``
     *  Rotation angle in counter-clockwise radians.
     */
    set rotation(num) {
        var graphic = SLD.graphic(this._symbolizer)
        graphic.setRotation(STYLE_UTIL._filterFactory.literal(num));
    },
    get rotation() {
        var graphic = SLD.graphic(this._symbolizer);
        return Number(graphic.getRotation());
    },

    /** api: config[fillColor]
     *  ``String``
     *  The fill color.
     */
    /** api: property[fillColor]
     *  ``String``
     *  The fill color.
     */
    set fillColor(color) {
        var fill = SLD.fill(this._symbolizer)
        fill.setColor(STYLE_UTIL._filterFactory.literal(color));
    },
    get fillColor() {
        var fill = SLD.fill(this._symbolizer);
        return String(fill.getColor());
    },

    /** api: config[fillOpacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    /** api: property[fillOpacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    set fillOpacity(num) {
        var fill = SLD.fill(this._symbolizer)
        fill.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    get fillOpacity() {
        var fill = SLD.fill(this._symbolizer);
        return Number(fill.getOpacity());
    }
    
    // TODO: external graphic

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
