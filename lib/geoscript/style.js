var UTIL = require("./util");
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
var Color = exports.Color = require("./style/color").Color;

/** api: classes[] = shape */
exports.Shape = require("./style/shape").Shape;

/** api: classes[] = style */
var Style = exports.Style = require("./style/style").Style;

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

var Filter = require("./filter").Filter;
var hsl2rgb = require("./style/color").hsl2rgb;

var gradient = exports.gradient = function(config) {
    config = UTIL.applyIf({
        type: "linear",
        classes: 5,
        inclusive: true
    }, config);
    var property = config.property;
    if (!property) {
        throw new Error("Gradient config must include a property name.");
    }
    var values = config.values;
    if (!values) {
        throw new Error("Gradient config must include a values array.");
    }
    var styles = config.styles;
    if (!styles) {
        throw new Error("Gradient config must include a styles array.");
    }
    var numValues = values.length;
    if (styles.length !== numValues) {
        throw new Error("Number of styles must equal number of values to create a gradient.");
    }
    var styleMap = {};
    var style;
    for (var i=0; i<numValues; ++i) {
        style = styles[i];
        if (!(style instanceof Style)) {
            style = new Style(style);
        }
        styleMap[values[i]] = style;
    }
    var startValue, endValue, delta, startStyle, endStyle, interval, steps;
    var classes = config.classes;
    var type = config.type;
    var parts = [];
    values.sort();
    for (var i=0, ii=numValues-1; i<ii; ++i) {
        startValue = values[i];
        endValue = values[i+1];
        delta = endValue - startValue;
        startStyle = styleMap[startValue];
        endStyle = styleMap[endValue];
        interval = delta / classes;
        for (var j=0; j<classes; ++j) {
            filter = (new Filter(property + " >= " + (startValue + (j * interval))))
                .and(property + " < " + (startValue + ((j + 1) * interval)));
            parts.push(
                interpolatedStyle(startStyle, endStyle, j / (classes - 1)).where(filter)
            );
        }
    }
    if (config.inclusive) {
        endValue = values[numValues-1];
        parts.push(
            styleMap[endValue].clone().where(property + " = " + endValue)
        );
    }
    return new Style({parts: parts});
};

var interpolatedStyle = function(startStyle, endStyle, fraction) {
    var startSymbolizer, endSymbolizer, symbolizer, 
        startHSL, endHSL, hsl,
        startOpacity, endOpacity, opacity,
        startWidth, endWidth, width;
    var parts = [];
    for (var i=0, ii=startStyle.parts.length; i<ii; ++i) {
        startSymbolizer = startStyle.parts[i];
        symbolizer = startSymbolizer.clone();
        endSymbolizer = endStyle.parts[i];
        if (!endSymbolizer) {
            throw new Error("Start style and end style must have equal number of parts.");
        }
        // interpolate color
        if ((startSymbolizer.brush instanceof Color) && (endSymbolizer.brush instanceof Color)) {
            startHSL = startSymbolizer.brush.hsl;
            endHSL = endSymbolizer.brush.hsl;
            if (startHSL && endHSL) {
                hsl = startHSL.map(function(start, index) {
                    return start + (fraction * (endHSL[index] - start));
                });
                symbolizer.brush = new Color(hsl2rgb(hsl));
            }
        }
        // interpolate opacity
        if (("opacity" in startSymbolizer) && ("opacity" in endSymbolizer)) {
            startOpacity = startSymbolizer.opacity;
            endOpacity = endSymbolizer.opacity;
            if (startOpacity.literal && endOpacity.literal) {
                startOpacity = parseFloat(startOpacity.text);
                endOpacity = parseFloat(endOpacity.text);
                opacity = startOpacity + (fraction * (endOpacity - startOpacity));
                symbolizer.opacity = opacity;
            }
        }
        // interpolate width
        if (("width" in startSymbolizer) && ("width" in endSymbolizer)) {
            startWidth = startSymbolizer.width;
            endWidth = endSymbolizer.width;
            if (startWidth.literal && endWidth.literal) {
                startWidth = parseFloat(startWidth.text);
                endOpacity = parseFloat(endWidth.text);
                width = startWidth + (fraction * (endWidth - startWidth));
                symbolizer.width = width;
            }
        }
        parts[i] = symbolizer;
    }
    return new Style({parts: parts});
};
