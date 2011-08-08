var UTIL = require("../util");
var Brush = require("./brush").Brush;
var Expression = require("../filter").Expression;

/** api: (define)
 *  module = style
 *  class = Color
 */

/** api: (extends)
 *  style/brush.js
 */
var Color = UTIL.extend(Brush, {
    
    /** api: constructor
     *  .. class:: Color
     *
     *      A brush that renders with a solid color.
     */
    constructor: function Color(config) {
        this.cache = {};
        if (config) {
            if (typeof config === "string" || config instanceof Array) {
                config = {value: config};
            }
        }
        Brush.prototype.constructor.apply(this, arguments);
    },

    /** api: property[opacity]
     *  ``Number``
     *  The opacity value (0 - 1).
     */
    set opacity(expression) {
        if (typeof expression === "number") {
            if (expression < 0 || expression > 1) {
                throw new Error("Opacity must be a number between 0 and 1 (inclusive)");
            }
            expression = Expression.literal(expression);
        } else if (!(expression instanceof Expression)) {
            throw new Error("Opacity value must be a number or expression");
        }
        this.cache.opacity = expression;
    },
    get opacity() {
        if (!("opacity" in this.cache)) {
            this.opacity = 1;
        }
        return this.cache.opacity;
    },
    
    /** api: property[value]
     *  ``String``
     *  The hex color value.  When setting the value, a CSS color name may be 
     *  used.  See http://www.w3schools.com/css/css_colornames.asp for supported
     *  color names.
     */
    set value(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(getHexColor(expression));
        } else if (expression instanceof Array) {
            expression = Expression.literal("#" +
                ("0" + expression[0].toString(16)).slice(-2) +
                ("0" + expression[1].toString(16)).slice(-2) +
                ("0" + expression[2].toString(16)).slice(-2)
            );
        } else if (!(expression instanceof Expression)) {
            throw new Error("Color value must be a number or expression");
        }
        this.cache.value = expression;
    },
    get value() {
        return this.cache.value;
    },

    toFullString: function() {
        return "value: " + this.value.text + ", opacity: " + this.opacity.text;
    }


});

exports.Color = Color;

/**
 * Lookup for CSS color names supported by major browsers.
 * http://www.w3schools.com/css/css_colornames.asp
 */
var cssColors = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
};

/** private: method[getHexColor]
 *  :arg color: ``String`` A CSS color name or hexidecimal color.
 *  :returns: ``String`` The hexideicmal color representation of the given 
 *      color.  Returns undefined if no hex representation can be derived.
 */
function getHexColor(color) {
    color = color.toLowerCase();
    var hex;
    if (color[0] === "#") {
        hex = color;
    } else if (color in cssColors) {
        hex = cssColors[color];
    } else if (color.match(/^[0-9a-f]{6}$/)) {
        hex = "#" + color;
    }
    return hex;
};
