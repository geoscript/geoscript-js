var DirectoryDataStore = Packages.org.geotools.data.directory.DirectoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");
var file = require("file");
var ShapefileDataStoreFactory = Packages.org.geotools.data.shapefile.ShapefileDataStoreFactory;

var prepConfig = function(config) {
    if (typeof config === "string" || config instanceof file.Path) {
        config = {path: String(config)};
    }
    if (!config.path) {
        throw "Directory config must include a path.";
    } else {
        if (!file.isDirectory(config.path)) {
            throw "Directory path must exist.";
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
var Directory = util.extend(Workspace, {
    
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
        return new DirectoryDataStore(
            util.toFile(config.path), new java.net.URI("http://geoscript.org")
        );
    },

    /** private: method[_createSource]
     *  :arg _schema: ``FeatureType``
     *  :arg type: ``String``
     *  :returns: ``FeatureSource``
     */
    _createSource: function(_schema, type) {
        
        // TODO: allow other types in addition to shapefile
        var factory = new ShapefileDataStoreFactory();
        var name = String(_schema.getName().getLocalPart());
        var url = util.toURL(file.join(this.path, name + ".shp"));
        var store = factory.createNewDataStore({url: url});
        store.createSchema(_schema);
        return store.getFeatureSource();
        
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

/** api: example
 *  Sample code create a new workspace for accessing data on the filesystem:
 * 
 *  .. code-block:: javascript
 *
 *      js> var dir = new workspace.Directory("data/shp");
 *      js> dir
 *      <Directory ["states"]>
 *      js> var states = dir.get("states");
 *      js> states
 *      <Layer name: states, count: 49>
 */

exports.Directory = Directory;

// register a directory factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(Directory, {
    handles: function(config) {
        var capable;
        try {
            config = prepConfig(config);
            capable = true;
        } catch (err) {
            capable = false;
        }
        return capable;
    }
}));
