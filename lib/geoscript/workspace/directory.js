var DirectoryDataStore = Packages.org.geotools.data.directory.DirectoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");

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
     *      :arg dir: ``String`` Path to the directory.
     *
     *      Create a workspace from a directory.
     */
    constructor: function DirectoryWorkspace(dir) {
        Workspace.prototype.constructor.apply(this, [dir]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.directory.DirectoryDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(dir) {
        return new DirectoryDataStore(
            util.toFile(dir), new java.net.URI("http://geoscript.org")
        );
    }
    
});

exports.DirectoryWorkspace = DirectoryWorkspace;
