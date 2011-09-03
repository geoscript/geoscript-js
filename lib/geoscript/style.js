var STYLE_UTIL = require("./style/util");

/** api: module = style */

/** api: synopsis
 *  A collection of style types.
 */

/** api: summary
 *  The :mod:`style` module provides a provides constructors for creating rule
 *  based styles for rendering layers in a map.
 *
 *  .. code-block:: javascript
 *  
 *      js> var STYLE = require("geoscript/style");
 */

/** private: classes[] = symbolizer */
exports.Symbolizer = require("./style/symbolizer").Symbolizer;

/** private: classes[] = fill */
exports.Fill = require("./style/fill").Fill;

/** private: classes[] = stroke */
exports.Stroke = require("./style/stroke").Stroke;

/** api: classes[] = brush */
exports.Brush = require("./style/brush").Brush;

/** api: classes[] = color */
exports.Color = require("./style/color").Color;

/** api: classes[] = shape */
exports.Shape = require("./style/shape").Shape;

/** api: classes[] = style */
exports.Style = require("./style/style").Style;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: ``Object``
 *
 *  Create a symbolizer, rule, or style object given a configuration object.
 */
exports.create = STYLE_UTIL.create;

/**
var style = gradient({
    type: "linear", // default
    classes: 5, // default
    values: [0, 100],
    property: "score",
    symbolizers: [Fill("red"), Fill("blue")]
}).and(
    Fill("yellow").where("score < 0")
).and(
    Fill("purple").where("score > 100")
).and(
    Stroke("black")
);
**/

var gradient = function(config) {
    var values = config.values;
    var symbolizer = config.symbolizers;
    var startValue, endValue, startSymbolizer, endSymbolizer, interval;
    var classes = config.classes || 5;
    var type = config.type || "linear";
    for (var i=0, ii=values.length-1; i<ii; ++i) {
        startValue = values[i];
        endValue = values[i+1];
        startSymbolizer = symbolizers[i];
        endSymbolizer = symbolizers[i+1];
        interval = config.interval;
        if (interval) {
            if (endValue > startValue) {
                if (interval < 0) {
                    interval = -interval;
                } else {
                    interval = interval;
                }
            } else {
                if (interval > 0) {
                    interval = -interval;
                } else {
                    interval = interval;
                }
            }
        } else {
            interval = (endValue - startValue) / classes;
        }
    }
};
