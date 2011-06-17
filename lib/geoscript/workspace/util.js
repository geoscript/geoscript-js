var Registry = require("../registry").Registry;

var registry = new Registry();

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`workspace.Workspace`
 *
 *  Create a workspace given a configuration object.
 */
exports.create = registry.create;

/** private: method[from_] */
exports.from_ = registry.from_;

/** private: method[register] */
exports.register = registry.register;
