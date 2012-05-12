var UTIL = require("./util");
var STYLE_UTIL = require("./style/util");
var Expression = require("./filter/expression").Expression;

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
var Symbolizer = exports.Symbolizer = require("./style/symbolizer").Symbolizer;

/** api: classes[] = fill */
var Fill = exports.Fill = require("./style/fill").Fill;

/** api: classes[] = stroke */
var Stroke = exports.Stroke = require("./style/stroke").Stroke;

/** api: classes[] = label */
var Label = exports.Label = require("./style/label").Label;

/** private: classes[] = brush */
var Brush = exports.Brush = require("./style/brush").Brush;

/** api: classes[] = color */
var Color = exports.Color = require("./style/color").Color;

/** api: classes[] = shape */
var Shape = exports.Shape = require("./style/shape").Shape;

/** api: classes[] = icon */
var Icon = exports.Icon = require("./style/icon").Icon;

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
    expression: "score",
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
    config = UTIL.applyIf(config, {
        method: "linear",
        classes: 5,
        inclusive: true
    });
    var expression = config.expression;
    if (!expression) {
        throw new Error("Gradient config must include a expression name.");
    } else if (expression instanceof Expression) {
        expression = "(" + expression.text + ")";
    }
    var values = config.values;
    if (!values) {
        throw new Error("Gradient config must include a values array.");
    }
    var styles = config.styles;
    if (!styles) {
        throw new Error("Gradient config must include a styles array.");
    }
    var method = config.method;
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
    var startValue, endValue, delta, startStyle, endStyle, v0, v1, filter;
    var classes = config.classes;
    var type = config.type;
    var parts = [];
    values.sort(function(a, b) {return a-b;});
    for (var i=0, ii=numValues-1; i<ii; ++i) {
        startValue = values[i];
        endValue = values[i+1];
        delta = endValue - startValue;
        startStyle = styleMap[startValue];
        endStyle = styleMap[endValue];
        for (var j=0; j<classes; ++j) {
            v0 = startValue + interpolatedValue(method, delta, j / classes);
            v1 = startValue + interpolatedValue(method, delta, (j + 1) / classes);
            filter = (new Filter(expression + " >= " + v0))
                .and(expression + " < " + v1);
            parts.push(
                interpolatedStyle(startStyle, endStyle, j / (classes - 1)).where(filter)
            );
        }
    }
    if (config.inclusive) {
        endValue = values[numValues-1];
        parts.push(
            styleMap[endValue].clone().where(expression + " = " + endValue)
        );
    }
    return new Style({parts: parts});
};

function interpolatedValue(method, delta, fraction) {
    var result;
    switch (method) {
        case "linear":
            result = fraction * delta;
            break;
        case "exponential":
            result = (parseFloat(Math.exp(fraction * Math.log(1 + delta)).toFixed(8)) - 1);
            break;
        case "logarithmic":
            result = delta * parseFloat((Math.log(fraction + 1) / Math.LN2).toFixed(8));
            break;
        default:
            throw new Error("Unsupported interpolation method: " + method);
    }
    return result;
}

var interpolatedStyle = function(startStyle, endStyle, fraction) {
    var startSymbolizer, endSymbolizer;
    var parts = [];
    for (var i=0, ii=startStyle.parts.length; i<ii; ++i) {
        startSymbolizer = startStyle.parts[i];
        endSymbolizer = endStyle.parts[i];
        if (!endSymbolizer) {
            throw new Error("Start style and end style must have equal number of parts.");
        }
        parts[i] = interpolateSymbolizer(startSymbolizer, endSymbolizer, fraction);
    }
    return new Style({parts: parts});
};

function interpolateSymbolizer(startSymbolizer, endSymbolizer, fraction) {
    var literals = ["width", "opacity", "size"];
    var symbolizer = startSymbolizer.clone();
    if ((startSymbolizer.brush instanceof Color) && (endSymbolizer.brush instanceof Color)) {
        var startHSL = startSymbolizer.brush.hsl;
        var endHSL = endSymbolizer.brush.hsl;
        if (startHSL && endHSL) {
            var hsl = startHSL.map(function(start, index) {
                return start + (fraction * (endHSL[index] - start));
            });
            symbolizer.brush = new Color(hsl2rgb(hsl));
        }
    }
    // interpolate literals
    var literal;
    for (var j=0, jj=literals.length; j<jj; ++j) {
        literal = interpolateLiteral(literals[j], startSymbolizer, endSymbolizer, fraction);
        if (literal !== null) {
            symbolizer[literals[j]] = literal;
        }
    }
    // handle shapes with fill and stroke
    if (startSymbolizer instanceof Shape && endSymbolizer instanceof Shape) {
        symbolizer.fill = interpolateSymbolizer(startSymbolizer.fill, endSymbolizer.fill, fraction);
        symbolizer.stroke = interpolateSymbolizer(startSymbolizer.stroke, endSymbolizer.stroke, fraction);
    }
    return symbolizer;
}

function interpolateLiteral(property, startSymbolizer, endSymbolizer, fraction) {
    var literal = null;
    if ((property in startSymbolizer) && (property in endSymbolizer)) {
        var startValue = startSymbolizer[property];
        var endValue = endSymbolizer[property];
        if (startValue.literal && endValue.literal) {
            startValue = parseFloat(startValue.text);
            endValue = parseFloat(endValue.text);
            literal = startValue + (fraction * (endValue - startValue));
        }
    }
    return literal;
}
