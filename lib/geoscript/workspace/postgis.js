var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var PostgisNGDataStoreFactory = Packages.org.geotools.data.postgis.PostgisNGDataStoreFactory;

/** api: (define)
 *  module = workspace
 *  class = PostgisWorkspace
 */

var prepConfig = function(config) {
    config = util.applyIf(config, PostgisWorkspace.prototype.defaults);
    return {
        host: config.host,
        port: java.lang.Integer(config.port),
        schema: config.schema,
        database: config.database,
        user: config.user,
        passwd: config.password,
        dbtype: config.type.toLowerCase().replace(/workspace$/, "")
    };
};

/** api: (extends)
 *  workspace/workspace.js
 */
var PostgisWorkspace = util.extend(Workspace, {
    
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
     *  .. class:: PostgisWorkspace
     *
     *      :arg path: ``String`` Path to the directory.
     *
     *      Create a workspace from a directory.
     */
    constructor: function PostgisWorkspace(config) {
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
            throw "PostgisWorkspace config must include database property.";
        }
        var factory = new PostgisNGDataStoreFactory();
        return factory.createDataStore(config);
    }
    
});

exports.PostgisWorkspace = PostgisWorkspace;

// register a postgis factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(PostgisWorkspace, {
    handles: function(config) {
        config = prepConfig(config);
        return (config.dbtype === "postgis");
    }
}));
