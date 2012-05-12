var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");
var H2DataStoreFactory = Packages.org.geotools.data.h2.H2DataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = H2
 */

var prepConfig = function(config) {
    if (config) {
        if (typeof config === "string") {
            config = {database: config};
        }
        if (typeof config.database !== "string") {
            throw "H2 config must include database path.";
        }
        config = {database: String(config.database)};
    }
    return config;
};

/** api: (extends)
 *  workspace/workspace.js
 */
var H2 = UTIL.extend(Workspace, {
    
    /** api: config[database]
     *  ``String``
     *  Path to the database (required).
     */

    /** api: constructor
     *  .. class:: H2
     *  
     *      :arg config: ``Object`` Configuration object.
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
        config.dbtype = "h2";
        var factory = new H2DataStoreFactory();
        return factory.createDataStore(config);
    },

    /** private: method[_onFeatureAdd]
     *  :arg feature: :class:`feature.Feature`
     *
     *  Do any specific processing on a feature before it is added to a layer.
     */
    _onFeatureAdd: function(feature) {
        // TODO: update when CRS is persisted in H2
        // if (feature.geometry) {
        //     var projection = feature.projection;
        //     if (projection) {
        //         feature.geometry._geometry.userData = projection._projection;
        //     }
        // }
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

/** api: example
 *  Sample code create a new workspace for accessing data in a H2 database:
 * 
 *  .. code-block:: javascript
 *
 *      js> var h2 = new WORKSPACE.H2({database: "data/h2/geoscript"});
 *      js> h2
 *      <H2 ["states"]>
 *      js> var states = h2.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.H2 = H2;

// register an H2 factory for the module
register(new Factory(H2, {
    handles: function(config) {
        var capable = false;
        if (config && typeof config.type === "string" && config.type.toLowerCase() === "h2") {
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
