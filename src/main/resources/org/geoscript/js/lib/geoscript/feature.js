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

/** api: classes[] = field */
exports.Field = require("./feature/field").Field;

/** api: classes[] = schema */
exports.Schema = require("./feature/schema").Schema;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`feature.Feature` or :class`feature.Schema`
 *
 *  Create a feature or schema given a configuration object.
 */
exports.create = require("./feature/util").create;
