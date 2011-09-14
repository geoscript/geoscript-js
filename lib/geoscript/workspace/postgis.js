var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var geotools = Packages.org.geotools;
var PostgisNGDataStoreFactory = geotools.data.postgis.PostgisNGDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = PostGIS
 */

var prepConfig = function(config) {
    if (config) {
        if (typeof config === "string") {
            config = {database: config};
        }
        if (typeof config.database !== "string") {
            throw "PostGIS config must include database name.";
        }
        config = UTIL.applyIf({}, config, PostGIS.prototype.defaults);
        config = {
            host: config.host,
            port: config.port,
            schema: config.schema,
            database: config.database,
            user: config.user,
            passwd: config.password
        };
    }
    return config;
};

/** api: (extends)
 *  workspace/workspace.js
 */
var PostGIS = UTIL.extend(Workspace, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        /** api: config[host]
         *  ``String``
         *  Hostname for database connection.  Default is ``"localhost"``.
         */
        host: "localhost",

        /** api: config[port]
         *  ``Number``
         *  Port for database connection.  Default is ``5432``.
         */
        port: 5432,

        /** api: config[schema]
         *  ``String``
         *  The named database schema containing the tables to be accessed.
         *  Default is ``"public"``.
         */
        schema: "public",

        /** api: config[user]
         *  ``String``
         *  Username for database connection.  Default is ``"postgres"``.
         */
        user: "postgres",

        /** api: config[password]
         *  ``String``
         *  Password for database connection.  Default is ``"postgres"``.
         */
        password: "postgres"
    },
    
    /** api: config[database]
     *  ``String``
     *  Database name (required).
     */

    /** api: constructor
     *  .. class:: PostGIS
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a workspace from a PostGIS enabled database.
     */
    constructor: function PostGIS(config) {
        Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.jdbc.JDBCDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        config.dbtype = "postgis";
        config.port = java.lang.Integer(config.port);
        var factory = new PostgisNGDataStoreFactory();
        return factory.createDataStore(config);
    },

    /** private: property[config]
     *  TODO: include user/pass in JSON?
     */
    get config() {
        return {
            type: this.constructor.name,
            host: this.host,
            port: this.port,
            schema: this.schema,
            database: this.database
        };
    }
    
});

/** private: staticmethod[from_]
 *  :arg _store: ``org.geotools.data.DataStore`` A GeoTools store.
 *  :returns: :class`PostGIS`
 *
 *  Create a geoscript workspace object from a GeoTools store.
 */
PostGIS.from_ = function(_store) {
    var workspace = new PostGIS();
    workspace._store = _store;
    return workspace;
};

/** api: example
 *  Sample code create a new workspace for accessing data in a PostGIS database:
 * 
 *  .. code-block:: javascript
 *
 *      js> var pg = new WORKSPACE.PostGIS({database: "geoscript"});
 *      js> pg
 *      <PostGIS ["states"]>
 *      js> var states = pg.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.PostGIS = PostGIS;

// register a postgis factory for the module
register(new Factory(PostGIS, {
    handles: function(config) {
        var capable = false;
        if (typeof config.type === "string" && config.type.toLowerCase() === "postgis") {
            try {
                config = prepConfig(config);
                capable = true;
            } catch (err) {
                // pass;
            }
        }
        return capable;
    },
    wraps: function(_store) {
        var wraps = false;
        if (_store instanceof geotools.jdbc.JDBCDataStore) {
            var dialect = _store.getSQLDialect();
            if (dialect instanceof geotools.data.postgis.PostGISDialect) {
                wraps = true;
            }
        }
        return wraps;
    }
}));
