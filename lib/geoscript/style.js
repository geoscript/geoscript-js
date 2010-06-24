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

/** private: classes[] = point */
exports.Symbolizer = require("./style/symbolizer").Symbolizer;

/** api: classes[] = point */
exports.PointSymbolizer = require("./style/point").PointSymbolizer;

/** api: classes[] = line */
exports.LineSymbolizer = require("./style/line").LineSymbolizer;

/** api: classes[] = polygon */
exports.PolygonSymbolizer = require("./style/polygon").PolygonSymbolizer;

/** api: classes[] = rule */
exports.Rule = require("./style/rule").Rule;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: ``Object``
 *
 *  Create a symbolizer, rule, or style object given a configuration object.
 */
exports.create = STYLE_UTIL.create;
