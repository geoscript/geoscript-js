var Registry = require("../registry").Registry;

var registry = new Registry();

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`filter.Filter`
 *
 *  Create a filter given a configuration object.
 */
exports.create = registry.create;

/** private: method[register] */
exports.register = registry.register;
