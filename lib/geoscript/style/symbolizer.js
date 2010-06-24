var UTIL = require("../util");
var STYLE_UTIL = require("./util");

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Symbolizer
 */

var Symbolizer = UTIL.extend(Object, {
    
    /** api: config[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    zIndex: 0,

    constructor: function Symbolizer() {
        
    },

    /** api: method[clone]
     *
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        return new STYLE_UTIL.create(config);
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
     *  The stroke opacity (``0``-``1``).
     */
    /** api: property[strokeOpacity]
     *  ``Number``
     *  The stroke opacity (``0``-``1``).
     */
    set strokeOpacity(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    get strokeOpacity() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getOpacity());
    },

    /** private: property[config]
     */
    get config() {
        return {};
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this symbolizer.
     */
    get json() {
        return JSON.stringify(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        var items = [];
        var config = this.config;
        var val;
        for (var key in config) {
            if (key !== "type") {
                val = config[key];
                if (typeof val === "string") {
                    val = '"' + val + '"';
                }
                items.push(key + ": " + val);
            }
        }
        return items.join(", ");
    }

});

exports.Symbolizer = Symbolizer;
