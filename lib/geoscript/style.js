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
    styles: [Fill("red"), Fill("blue")]
}).and(
    Fill("yellow").where("score < 0")
).and(
    Fill("purple").where("score > 100")
).and(
    Stroke("black")
);
**/

var Filter = require("../filter").Filter;
var gradient = function(config) {
    // TODO: sort values and styles
    config = UTIL.applyIf({
        type: "linear",
        classes: 5
    }, config);
    var values = config.values;
    var styles = config.styles;
    var startValue, endValue, delta, startStyle, endStyle, interval, steps;
    var classes = config.classes;
    var type = config.type || "linear";
    var parts = [];
    for (var i=0, ii=values.length-1; i<ii; ++i) {
        startValue = values[i];
        endValue = values[i+1];
        delta = endValue - startValue;
        startStyle = styles[i];
        endStyle = styles[i+1];
        interval = config.interval;
        if (!interval) {
            interval = delta / classes;
        }
        steps = Math.ceil(delta / interval);
        for (var value = startValue; value<=endValue; value+=interval) {
            filter = (new Filter(property + " >= " + value))
                .and(property + " < " Math.max(endValue, value+interval));
            parts.push(
                betweenStyle(startStyle, endStyle, (value - startValue) / delta).where(filter)
            );
        }
    }
};

var betweenStyle = function(startStyle, endStyle, fraction) {
    var startSymbolizer, endSymbolizer;
    for (var i=0, ii=startStyle.parts.length; i<ii; ++i) {
        startSymbolizer = startSyle.parts[i];
        endSymbolizer = endStyle.parts[i];
        // TODO: create between symbolizer
    }
};
