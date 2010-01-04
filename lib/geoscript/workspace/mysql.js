var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var MySQLDataStoreFactory = Packages.org.geotools.data.mysql.MySQLDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = MySQL
 */

var prepConfig = function(config) {
    config = util.applyIf({}, config, MySQL.prototype.defaults);
    return {
        host: config.host,
        port: java.lang.Integer(config.port),
        database: config.database,
        user: config.user,
        passwd: config.password,
        dbtype: config.type.toLowerCase()
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
        password: "mysql",
        type: "mysql"
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
        if (!config.database) {
            throw "MySQL config must include database property.";
        }
        var factory = new MySQLDataStoreFactory();
        return factory.createDataStore(config);
    }
    
});

exports.MySQL = MySQL;


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

// register a MySQL factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(MySQL, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "mysql");
    }
}));
