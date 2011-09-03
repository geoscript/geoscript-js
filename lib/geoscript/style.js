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

var symbolizerLookup = {
    "Surface": "Polygon",
    "Curve": "Line",
    "LineString": "Line"
};

exports.getSymbolizerTypeFromGeometryType = function(geometryType) {
    var symbolizerType = null;
    var simpleType = geometryType.replace(/^Multi(.*)$/, "$1");
    if (simpleType) {
        symbolizerType = (symbolizerLookup[simpleType] || simpleType) + "Symbolizer";
        if (!(symbolizerType in exports)) {
            symbolizerType = null;
        }
    }
    return symbolizerType;
};

