/** api: module = workspace */

/** api: synopsis
 *  A collection of workspace types.
 */

/** api: summary
 *  The :mod:`workspace` module provides a provides constructors for different
 *  workspace types.
 *
 *  .. code-block:: javascript
 *  
 *      js> var WORKSPACE = require("geoscript/workspace");
 */

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`workspace.Workspace`
 *
 *  Create a workspace given a configuration object.
 */
exports.create = require("./workspace/util").create;

/** private: classes[] = workspace */
exports.Workspace = require("./workspace/workspace").Workspace;

/** api: classes[] = memory */
exports.Memory = require("./workspace/memory").Memory;

/** api: classes[] = directory */
exports.Directory = require("./workspace/directory").Directory;

/** api: classes[] = postgis */
exports.PostGIS = require("./workspace/postgis").PostGIS;

/** api: classes[] = h2 */
exports.H2 = require("./workspace/h2").H2;

/** api: classes[] = mysql */
exports.MySQL = require("./workspace/mysql").MySQL;

/** private: classes[] = spatialite */
exports.SpatiaLite = require("./workspace/spatialite").SpatiaLite;

/** api: property[memory]
 *  :class:`workspace.Memory`
 *  A memory workspace that will be used to collect all temporary layers
 *  created without a specific workspace.
 */
exports.memory = new exports.Memory();
