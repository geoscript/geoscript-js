var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var H2DataStoreFactory = Packages.org.geotools.data.h2.H2DataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = H2
 */

var prepConfig = function(config) {
    config = util.applyIf({}, config, H2.prototype.defaults);
    return {
        database: config.database,
        dbtype: config.type.toLowerCase()
    };
};

/** api: (extends)
 *  workspace/workspace.js
 */
var H2 = util.extend(Workspace, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        type: "h2"
    },
    
    /** api: constructor
     *  .. class:: H2
     *  
     *      Create a workspace from an H2 database.
     */
    constructor: function H2(config) {
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
            throw "H2 config must include database property.";
        }
        var factory = new H2DataStoreFactory();
        return factory.createDataStore(config);
    },

    /** private: method[_onFeatureAdd]
     *  :arg feature: :class:`feature.Feature`
     *
     *  Do any specific processing on a feature before it is added to a layer.
     */
    _onFeatureAdd: function(feature) {
        if (feature.geometry) {
            var projection = feature.projection;
            if (projection) {
                feature.geometry._geometry.userData = projection._projection;
            }
        }
    }
    
});

exports.H2 = H2;

// register an H2 factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(H2, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "h2");
    }
}));
