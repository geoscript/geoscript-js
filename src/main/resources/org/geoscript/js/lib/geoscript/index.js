var Util = require("./util");
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;

Packages.org.geoscript.js.index.Module.init(this);
exports.QuadTree = this["org.geoscript.js.index.Quadtree"];
exports.STRtree  = this["org.geoscript.js.index.STRtree"];

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`index.QuadTree`
 *
 *  Create a map given a configuration object.
 */
var registry = new Registry();
exports.create = registry.create;

// register a QuadTree factory for the module
registry.register(new Factory(exports.QuadTree, {
  handles: function(config) {
    return true;
  }
}));

// register a STRtree factory for the module
registry.register(new Factory(exports.STRtree, {
  handles: function(config) {
    return true;
  }
}));