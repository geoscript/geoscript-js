var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var SpatiaLiteDataStoreFactory = Packages.org.geotools.data.spatialite.SpatiaLiteDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = SpatiaLite
 */

var prepConfig = function(config) {
    config = util.applyIf({}, config, SpatiaLite.prototype.defaults);
    return {
        database: config.database,
        dbtype: config.type.toLowerCase()
    };
};

/** api: (extends)
 *  workspace/workspace.js
 */
var SpatiaLite = util.extend(Workspace, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        type: "spatialite"
    },
    
    /** api: constructor
     *  .. class:: SpatiaLite
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
        if (!config.database) {
            throw "SpatiaLite config must include database property.";
        }
        var factory = new SpatiaLiteDataStoreFactory();
        return factory.createDataStore(config);
    }
    
});

exports.SpatiaLite = SpatiaLite;

// register a spatialite factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(SpatiaLite, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "spatialite");
    }
}));
