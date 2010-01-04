var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var MySQLDataStoreFactory = Packages.org.geotools.data.mysql.MySQLDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = MySQL
 */

var prepConfig = function(config) {
    if (typeof config.database !== "string") {
        throw "MySQL config must include database name.";
    }
    config = util.applyIf({}, config, MySQL.prototype.defaults);
    return {
        host: config.host,
        port: java.lang.Integer(config.port),
        database: config.database,
        user: config.user,
        passwd: config.password
    };
};

/** api: (extends)
 *  workspace/workspace.js
 */
var MySQL = util.extend(Workspace, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "mysql"
    },
    
    /** api: constructor
     *  .. class:: MySQL
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
 *      js> var mysql = new workspace.MySQL({database: "geoscript"});
 *      js> mysql
 *      <MySQL ["states"]>
 *      js> var states = mysql.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.MySQL = MySQL;

// register a MySQL factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(MySQL, {
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
