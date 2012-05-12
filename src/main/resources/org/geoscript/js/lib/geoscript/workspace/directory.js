var register = require("./util").register;
var Factory = require("../factory").Factory;
var Workspace = require("./workspace").Workspace;
var UTIL = require("../util");

var geotools = Packages.org.geotools;
var ShapefileDataStoreFactory = geotools.data.shapefile.ShapefileDataStoreFactory;

var prepConfig = function(config) {
    if (config) {
        if (typeof config === "string") {
            config = {path: String(config)};
        }
        if (!config.path) {
            throw "Directory config must include a path.";
        }        
    }
    return config;
};

/** api: (define)
 *  module = workspace
 *  class = Directory
 */

/** api: (extends)
 *  workspace/workspace.js
 */
var Directory = UTIL.extend(Workspace, {
    
    /** api: property[path]
     *  ``String``
     *  The absolute directory path.
     */
    
    /** api: constructor
     *  .. class:: Directory
     *
     *      :arg path: ``String`` Path to the directory.
     *
     *      Create a workspace from a directory.
     */
    constructor: function Directory(config) {
        Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.directory.DirectoryDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        if (!UTIL.isDirectory(config.path)) {
            throw "Directory path must exist.";
        }
        var factory = new ShapefileDataStoreFactory();
        return factory.createDataStore({url: UTIL.toURL(config.path)});
    },

    /** private: property[config]
     */
    get config() {
        return {
            type: this.constructor.name,
            path: this.path
        };
    }
    
});

/** private: staticmethod[from_]
 *  :arg _store: ``org.geotools.data.DataStore`` A GeoTools store.
 *  :returns: :class`Directory`
 *
 *  Create a geoscript workspace object from a GeoTools store.
 */
Directory.from_ = function(_store) {
    var workspace = new Directory();
    workspace._store = _store;
    return workspace;
};

/** api: example
 *  Sample code create a new workspace for accessing data on the filesystem:
 * 
 *  .. code-block:: javascript
 *
 *      js> var dir = new WORKSPACE.Directory("data/shp");
 *      js> dir
 *      <Directory ["states"]>
 *      js> var states = dir.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.Directory = Directory;

// register a directory factory for the module
register(new Factory(Directory, {
    handles: function(config) {
        var capable;
        try {
            config = prepConfig(config);
            capable = true;
        } catch (err) {
            capable = false;
        }
        return capable;
    },
    wraps: function(_store) {
        return (
            _store instanceof geotools.data.shapefile.ShapefileDataStore ||
            _store instanceof geotools.data.directory.DirectoryDataStore
        );
    }
}));
