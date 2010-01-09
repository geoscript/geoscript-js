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

require("./util").createRegistry(exports);

/** api: classes[] = feature */
exports.Feature = require("./feature/feature").Feature;

/** api: classes[] = schema */
exports.Schema = require("./feature/schema").Schema;
