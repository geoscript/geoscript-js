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
