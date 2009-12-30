var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var MySQLDataStoreFactory = Packages.org.geotools.data.mysql.MySQLDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = MySQL
 */

var prepConfig = function(config) {
    config = util.applyIf({}, config, MySQL.prototype.defaults);
    // TODO: upgrade to get mysql instead of mysqlng
    if (config.type && config.type.toLowerCase() === "mysql") {
        config.type = "mysqlng"
    };
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
        type: "mysqlng"
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
     *  :returns: ``org.geotools.data.directory.DirectoryDataStore``
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

// register a MySQL factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(MySQL, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "mysqlng");
    }
}));
