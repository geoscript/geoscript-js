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

