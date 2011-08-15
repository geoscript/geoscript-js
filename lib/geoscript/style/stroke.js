var UTIL = require("../util");
var Brush = require("./brush").Brush;
var Symbolizer = require("./symbolizer").Symbolizer;
var Color = require("./color").Color;
var Expression = require("../filter").Expression;

/** api: (define)
 *  module = style
 *  class = Stroke
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Stroke = exports.Stroke = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Stroke
     *
     *      A symbolizer for stroking geometries.
     */
    constructor: function Stroke(config) {
        if (config) {
            if (typeof config.brush === "string") {
                config.brush = new Color(config.brush);
            }
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
    },

    /** api: property[width]
     *  ``Number``
     *  The pixel width of the stroke.  Default is ``1``.
     */
    set width(expression) {
        if (!(expression instanceof Expression)) {
            expression = new Expression(expression);
        }
        this.cache.width = expression;
    },
    get width() {
        if (!("width" in this.cache)) {
            this.width = 1;
        }
        return this.cache.width;
    },
    
    get config() {
        return {
            type: "Stroke",
            brush: this.brush.config,
            opacity: this.opacity.config,
            width: this.width.config
        };
    }

});

