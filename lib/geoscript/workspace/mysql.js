var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");
var MySQLDataStoreFactory = Packages.org.geotools.data.mysql.MySQLDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = MySQL
 */

var prepConfig = function(config) {
    if (config) {
        if (typeof config === "string") {
            config = {database: config};
        }
        if (typeof config.database !== "string") {
            throw "MySQL config must include database name.";
        }
        config = UTIL.applyIf({}, config, MySQL.prototype.defaults);
        config = {
            host: config.host,
            port: java.lang.Integer(config.port),
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
var MySQL = UTIL.extend(Workspace, {
    
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
         *  Port for database connection.  Default is ``3306``.
         */
        port: 3306,

        /** api: config[user]
         *  ``String``
         *  Username for database connection.  Default is ``"root"``.
         */
        user: "root",

        /** api: config[password]
         *  ``String``
         *  Password for database connection.  Default is ``"mysql"``.
         */
        password: "mysql"
    },
    
    /** api: config[database]
     *  ``String``
     *  Database name (required).
     */

    /** api: constructor
     *  .. class:: MySQL
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a workspace from a MySQL database.
     */
    constructor: function MySQL(config) {
        Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.jdbc.JDBCDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        config.dbtype = "mysql";
        config.port = java.lang.Integer(config.port);
        var factory = new MySQLDataStoreFactory();
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
            database: this.database
        };
    }
    
});

/** api: example
 *  Sample code create a new workspace for accessing data in a MySQL database:
 * 
 *  .. code-block:: javascript
 *
 *      js> var mysql = new WORKSPACE.MySQL({database: "geoscript"});
 *      js> mysql
 *      <MySQL ["states"]>
 *      js> var states = mysql.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.MySQL = MySQL;

// register a MySQL factory for the module
register(new Factory(MySQL, {
    handles: function(config) {
        var capable = false;
        if (typeof config.type === "string" && config.type.toLowerCase() === "mysql") {
            try {
                config = prepConfig(config);
                capable = true;
            } catch (err) {
                // pass;
            }
        }
        return capable;
    }
}));
