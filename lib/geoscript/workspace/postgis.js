var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var PostgisNGDataStoreFactory = Packages.org.geotools.data.postgis.PostgisNGDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = PostGIS
 */

var prepConfig = function(config) {
    config = util.applyIf({}, config, PostGIS.prototype.defaults);
    return {
        host: config.host,
        port: java.lang.Integer(config.port),
        schema: config.schema,
        database: config.database,
        user: config.user,
        passwd: config.password,
        dbtype: config.type.toLowerCase()
    };
};

/** api: (extends)
 *  workspace/workspace.js
 */
var PostGIS = util.extend(Workspace, {
    
    /** private: property[defaults]
     *  ``Object``
     */
    defaults: {
        host: "localhost",
        port: 5432,
        schema: "public",
        user: "postgres",
        password: "postgres",
        type: "postgis"
    },
    
    /** api: constructor
     *  .. class:: PostGIS
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
        if (!config.database) {
            throw "PostGIS config must include database property.";
        }
        var factory = new PostgisNGDataStoreFactory();
        return factory.createDataStore(config);
    }
    
});

/** api: example
 *  Sample code create a new workspace for accessing data in a PostGIS database:
 * 
 *  .. code-block:: javascript
 *
 *      js> var pg = new workspace.PostGIS({database: "geoscript"});
 *      js> pg
 *      <PostGIS ["states"]>
 *      js> var states = pg.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.PostGIS = PostGIS;

// register a postgis factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(PostGIS, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "postgis");
    }
}));
