var geotools = Packages.org.geotools;
var Registry = require("../registry").Registry;

var registry = new Registry();

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: ``Object`` A symbolizer or a rule.
 *
 *  Create a symbolizer or a rule given a configuration object.
 */
exports.create = registry.create;

/** private: method[register] */
exports.register = registry.register;

exports._builder = new geotools.styling.StyleBuilder();
exports._filterFactory = geotools.factory.CommonFactoryFinder.getFilterFactory(null);

// operation for converting rgb values to hsl values
var rgb2hsl = exports.rgb2hsl = function(rgb) {
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
    var max = Math.max(r, g, b), 
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};

// helper function for hsl2rgb operation
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

// operation for converting hsl values to rgb values
var hsl2rgb = exports.hsl2rgb = function(hsl) {
    var r, g, b;
    var h = hsl[0],
        s = hsl[1],
        l = hsl[2];

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
};
