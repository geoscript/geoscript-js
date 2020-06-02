var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var GeobufDataStoreFactory = Packages.org.geotools.data.geobuf.GeobufDataStoreFactory;

/** private: (define)
 *  module = workspace
 *  class = Geobuf
 */

var prepConfig = function(config) {
  if (config) {
    if (typeof config === "string") {
      config = {file: config};
    }
    if (!(typeof config.file === "string")) {
      throw "Geobuf config must include file path.";
    }
    config = {
      file: String(config.file)
    };
  }
  return config;
};

/** private: (extends)
 *  workspace/workspace.js
 */
var Geobuf = UTIL.extend(Workspace, {

  /** private: config[file]
   *  ``String``
   *  Path to the directory (required).
   */

  /** private: constructor
   *  .. class:: Geobuf
   *
   *    :arg config: ``Object`` Configuration object.
   *
   *    Create a workspace from a Geobuf directory.
   */
  constructor: function Geobuf(config) {
    Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
  },

  /** private: method[_create]
   *  :arg config: ``Object``
   *  :returns: ``org.geotools.data.geobuf.GeobufDataStore``
   *
   *  Create the underlying store for the workspace.
   */
  _create: function(config) {
    var factory = new GeobufDataStoreFactory();
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

exports.Geobuf = Geobuf;

// register a Geobuf factory for the module
register(new Factory(Geobuf, {
  handles: function(config) {
    var capable = false;
    if (typeof config.type === "string" && config.type.toLowerCase() === "Geobuf") {
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
