var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Symbolizer = require("./symbolizer").Symbolizer;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = LineSymbolizer
 */

/** api: (extends)
 *  style/symbolizer.js
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
    },
    
    // TODO: graphic stroke

    /** private: property[config]
     */
    get config() {
        return {
            type: "LineSymbolizer",
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            strokeOpacity: this.strokeOpacity,
            strokeLineCap: this.strokeLineCap,
            strokeDashArray: this.strokeDashArray
        };
    }

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

// register a line symbolizer factory for the module
STYLE_UTIL.register(new Factory(LineSymbolizer, {
    handles: function(config) {
        return config.defaultSymbolizerType === "LineSymbolizer";
    }
}));
