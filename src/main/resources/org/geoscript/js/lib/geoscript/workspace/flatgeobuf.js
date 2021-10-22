var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var URLs = Packages.org.geotools.util.URLs;
var FlatGeobufDataStoreFactory = Packages.org.geotools.data.flatgeobuf.FlatGeobufDataStoreFactory;

/** private: (define)
 *  module = workspace
 *  class = Flatgeobuf
 */

var prepConfig = function(config) {
  if (config) {
    if (typeof config === "string") {
      config = {'url': config};
    }
    if (!(typeof config.file === "string")) {
      throw "Flatgeobuf config must include file path.";
    }
    config = {
      'url': String(URLs.fileToUrl(UTIL.toFile(config.file)))
    };
  }
  return config;
};

/** private: (extends)
 *  workspace/workspace.js
 */
var Flatgeobuf = UTIL.extend(Workspace, {

  /** private: config[file]
   *  ``String``
   *  Path to the file (required).
   */

  /** private: constructor
   *  .. class:: Flatgeobuf
   *
   *    :arg config: ``Object`` Configuration object.
   *
   *    Create a workspace from a Flatgeobuf directory.
   */
  constructor: function Flatgeobuf(config) {
    Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
  },

  /** private: method[_create]
   *  :arg config: ``Object``
   *  :returns: ``org.geotools.data.flatgeobuf.FlatgeobufDataStore``
   *
   *  Create the underlying store for the workspace.
   */
  _create: function(config) {
    var factory = new FlatGeobufDataStoreFactory();
    return factory.createDataStore(config);
  },

  /** private: property[config]
   */
  get config() {
    return {
      type: this.constructor.name,
      file: this.file
    };
  }

});

exports.Flatgeobuf = Flatgeobuf;

// register a Flatgeobuf factory for the module
register(new Factory(Flatgeobuf, {
  handles: function(config) {
    var capable = false;
    if (typeof config.type === "string" && config.type.toLowerCase() === "Flatgeobuf") {
      try {
        config = prepConfig(config);
        capable = true;
      } catch (err) {
        // pass
      }
    }
    return capable;
  }
}));
