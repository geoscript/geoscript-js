var UTIL = require("../util");
var Color = require("./color").Color;
var Symbolizer = require("./symbolizer").Symbolizer;

/** api: (define)
 *  module = style
 *  class = Fill
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Fill = exports.Fill = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Fill
     *
     *      A symbolizer for filling polygon geometries.
     */
    constructor: function Fill(config) {
        if (config) {
            if (typeof config.brush === "string") {
                config.brush = new Color(config.brush);
            }
        }
        Symbolizer.prototype.constructor.apply(this, arguments);
    },

    get config() {
        return {
            type: "Fill",
            brush: this.brush && this.brush.config,
            opacity: this.opacity.config
        };
    }

});

