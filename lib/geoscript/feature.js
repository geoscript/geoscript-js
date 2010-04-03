/** api: module = feature */

/** api: synopsis
 *  Feature related functionality.
 */

/** api: summary
 *  The :mod:`feature` module provides a provides constructors for features
 *  and feature schema.
 *
 *  .. code-block:: javascript
 *  
 *      js> var FEATURE = require("geoscript/feature");
 */

/** api: classes[] = feature */
exports.Feature = require("./feature/feature").Feature;

/** api: classes[] = schema */
exports.Schema = require("./feature/schema").Schema;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry given a configuration object.
 */
exports.create = require("./feature/util").create;
