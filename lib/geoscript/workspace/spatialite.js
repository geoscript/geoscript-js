var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var SpatiaLiteDataStoreFactory = Packages.org.geotools.data.spatialite.SpatiaLiteDataStoreFactory;

/** private: (define)
 *  module = workspace
 *  class = SpatiaLite
 */

var prepConfig = function(config) {
    if (config) {
        if (typeof config === "string") {
            config = {database: config};
        }
        if (!(typeof config.database === "string" || config.database instanceof file.Path)) {
            throw "SpatiaLite config must include database path.";
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
var SpatiaLite = UTIL.extend(Workspace, {
    
    /** private: config[database]
     *  ``String``
     *  Path to the database (required).
     */

    /** private: constructor
     *  .. class:: SpatiaLite
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a workspace from a SpatiaLite enabled database.
     */
    constructor: function SpatiaLite(config) {
        Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.jdbc.JDBCDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        config.dbtype = "spatialite";
        var factory = new SpatiaLiteDataStoreFactory();
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

exports.SpatiaLite = SpatiaLite;

// register a spatialite factory for the module
register(new Factory(SpatiaLite, {
    handles: function(config) {
        var capable = false;
        if (typeof config.type === "string" && config.type.toLowerCase() === "spatialite") {
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
