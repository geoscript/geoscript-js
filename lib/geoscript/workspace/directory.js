var DirectoryDataStore = Packages.org.geotools.data.directory.DirectoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");


var prepConfig = function(config) {
    if (typeof config === "string") {
        config = {path: config};
    }
    return config;
};

/** api: (define)
 *  module = workspace
 *  class = DirectoryWorkspace
 */

/** api: (extends)
 *  workspace/workspace.js
 */
var DirectoryWorkspace = util.extend(Workspace, {
    
    /** api: constructor
     *  .. class:: DirectoryWorkspace
     *
     *      :arg path: ``String`` Path to the directory.
     *
     *      Create a workspace from a directory.
     */
    constructor: function DirectoryWorkspace(config) {
        Workspace.prototype.constructor.apply(this, [prepConfig(config)]);
    },
    
    /** api: property[path]
     *  ``String``
     *  The absolute directory path.
     */
    get path() {
        var source = this._store.getInfo().getSource();
        return String(source.getPath());
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
    }
    
});

exports.DirectoryWorkspace = DirectoryWorkspace;

// register a directory factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(DirectoryWorkspace, {
    handles: function(config) {
        config = prepConfig(config);
        return (typeof config.path === "string");
    }
}));
