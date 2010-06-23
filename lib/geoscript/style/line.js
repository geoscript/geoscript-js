var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Symbolizer = require("./symbolizer").Symbolizer;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = LineSymbolizer
 */

var LineSymbolizer = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: LineSymbolizer
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a symbolizer for rendering features with line geometries.
     */
    constructor: function LineSymbolizer(config) {
        if (config) {
            this._symbolizer = STYLE_UTIL._builder.createLineSymbolizer();
            UTIL.apply(this, config);
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
    },
    
    /** api: config[strokeColor]
     *  ``String``
     *  The stroke color.
     */
    /** api: property[strokeColor]
     *  ``String``
     *  The stroke color.
     */
    set strokeColor(color) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setColor(STYLE_UTIL._filterFactory.literal(color));
    },
    get strokeColor() {
        var stroke = SLD.stroke(this._symbolizer);
        return String(stroke.getColor());
    },

    /** api: config[strokeWidth]
     *  ``Number``
     *  The stroke width.
     */
    /** api: property[strokeWidth]
     *  ``Number``
     *  The stroke width.
     */
    set strokeWidth(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setWidth(STYLE_UTIL._filterFactory.literal(num));
    },
    get strokeWidth() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getWidth());
    },

    /** api: config[strokeOpacity]
     *  ``Number``
     *  The stroke opacity (0-1).
     */
    /** api: property[strokeOpacity]
     *  ``Number``
     *  The stroke opacity (0-1).
     */
    set strokeOpacity(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    get strokeOpacity() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getOpacity());
    },

    /** api: config[strokeLineCap]
     *  ``String``
     *  The stroke line cap style.
     */
    /** api: property[strokeLineCap]
     *  ``String``
     *  The stroke line cap style.
     */
    set strokeLineCap(style) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setLineCap(STYLE_UTIL._filterFactory.literal(style));
    },
    get strokeLineCap() {
        var stroke = SLD.stroke(this._symbolizer);
        return String(stroke.getLineCap());
    },
    
    /** api: config[strokeDashArray]
     *  ``Array``
     *  The stroke dash style.
     */
    /** api: property[strokeDashArray]
     *  ``Array``
     *  The stroke dash style.
     */
    set strokeDashArray(list) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setDashArray(list);
    },
    get strokeDashArray() {
        var stroke = SLD.stroke(this._symbolizer);
        return stroke.getDashArray();
    }
    
    // TODO: graphic stroke

});

/** api: example
 *  Sample code to new line symbolizer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var symbolizer = new STYLE.LineSymbolizer({
 *        >     strokeColor: "#ffcc33",
 *        >     strokeOpacity: 0.5
 *        > });
 */

exports.LineSymbolizer = LineSymbolizer;
