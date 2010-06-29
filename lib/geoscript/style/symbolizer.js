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

    /** api: constructor
     *  .. class:: Symbolizer
     *
     *      Instances of the symbolizer base class are not created directly.  
     *      See the constructor details for one of the symbolizer subclasses.
     */
    constructor: function Symbolizer() {
        
    },

    /** api: method[clone]
     *  :arg config: ``Object`` Optional configuration object.
     *  :returns: :class:`style.Symbolizer` A symbolizer of the same type as 
     *      this one.
     *
     *  Create a copy of this symbolizer.  The optional ``config`` argument
     *  can be used to override any of this symbolizer's properties for the
     *  clone.
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        return new STYLE_UTIL.create(config);
    },

    /** api: config[strokeColor]
     *  ``String``
     *  The stroke color.  This may be a named CSS color (e.g. ``"olive"``) or a 
     *  hexidecimal color value (e.g. ``"#808000"``).
     */
    set strokeColor(color) {
        var hex = STYLE_UTIL.getHexColor(color);
        if (hex) {
            var stroke = SLD.stroke(this._symbolizer);
            stroke.setColor(STYLE_UTIL._filterFactory.literal(hex));
        } else {
            throw new Error("Can't determine hex color from strokeColor '" + color + "'.")
        }
    },
    /** api: property[strokeColor]
     *  ``String``
     *  The stroke color.
     */
    get strokeColor() {
        var stroke = SLD.stroke(this._symbolizer);
        return String(stroke.getColor());
    },

    /** api: config[strokeWidth]
     *  ``Number``
     *  The stroke width in pixels.
     */
    set strokeWidth(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setWidth(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[strokeWidth]
     *  ``Number``
     *  The stroke width in pixels.
     */
    get strokeWidth() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getWidth());
    },

    /** api: config[strokeOpacity]
     *  ``Number``
     *  The stroke opacity (``0``-``1``).
     */
    set strokeOpacity(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[strokeOpacity]
     *  ``Number``
     *  The stroke opacity (``0``-``1``).
     */
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
