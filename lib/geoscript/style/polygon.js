var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Symbolizer = require("./symbolizer").Symbolizer;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = PolygonSymbolizer
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var PolygonSymbolizer = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: PolygonSymbolizer
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a symbolizer for rendering features with polygon geometries.
     */
    constructor: function PolygonSymbolizer(config) {
        if (config) {
            this._symbolizer = STYLE_UTIL._builder.createPolygonSymbolizer();
            UTIL.apply(this, config);
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
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
    },
    
    // TODO: external graphic

    /** private: property[config]
     */
    get config() {
        return {
            type: "PolygonSymbolizer",
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            strokeOpacity: this.strokeOpacity,
            fillColor: this.fillColor,
            fillOpactiy: this.fillOpacity
        };
    }

});

/** api: example
 *  Sample code to new polygon symbolizer:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var symbolizer = new STYLE.PolygonSymbolizer({
 *        >     strokeColor: "#ffcc33",
 *        >     fillColor: "#ccaa00",
 *        >     fillOpacity: 0.5
 *        > });
 */

exports.PolygonSymbolizer = PolygonSymbolizer;

// register a polygon symbolizer factory for the module
STYLE_UTIL.register(new Factory(PolygonSymbolizer));
