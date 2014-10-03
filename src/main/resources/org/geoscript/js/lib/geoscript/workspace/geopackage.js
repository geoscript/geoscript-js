var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var GeoPkgDataStoreFactory = Packages.org.geotools.geopkg.GeoPkgDataStoreFactory;

/** private: (define)
 *  module = workspace
 *  class = GeoPackage
 */

var prepConfig = function(config) {
  if (config) {
    if (typeof config === "string") {
      config = {database: config};
    }
    if (!(typeof config.database === "string" || config.database instanceof file.Path)) {
      throw "GeoPackage config must include database path.";
    }
    config = {
      database: String(config.database)
    };
  }
  return config;
};

/** private: (extends)
 *  workspace/workspace.js
 */
var GeoPackage = UTIL.extend(Workspace, {

  /** private: config[database]
   *  ``String``
   *  Path to the database (required).
   */

  /** private: constructor
   *  .. class:: GeoPackage
   *
   *    :arg config: ``Object`` Configuration object.
   *
   *    Create a workspace from a GeoPackage enabled database.
   */
  constructor: function GeoPackage(config) {
    Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
  },

  /** private: method[_create]
   *  :arg config: ``Object``
   *  :returns: ``org.geotools.jdbc.JDBCDataStore``
   *
   *  Create the underlying store for the workspace.
   */
  _create: function(config) {
    config.dbtype = "geopkg";
    var factory = new GeoPkgDataStoreFactory();
    return factory.createDataStore(config);
  },

  /** private: property[config]
   */
  get config() {
    return {
      type: this.constructor.name,
      database: this.database
    };
  }

});

exports.GeoPackage = GeoPackage;

// register a geopackage factory for the module
register(new Factory(GeoPackage, {
  handles: function(config) {
    var capable = false;
    if (typeof config.type === "string" && config.type.toLowerCase() === "geopackage") {
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
