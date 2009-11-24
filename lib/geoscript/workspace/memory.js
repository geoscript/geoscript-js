var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");

/** api: (define)
 *  module = workspace
 *  class = MemoryWorkspace
 */

/** api: (extends)
 *  workspace/workspace.js
 */
var MemoryWorkspace = util.extend(Workspace, {
    
    /** api: constructor
     *  .. class:: MemoryWorkspace
     *
     *      Create a memory based workspace.
     */
    constructor: function MemoryWorkspace(config) {
        Workspace.prototype.constructor.apply(this, [config]);
    },
    
    /** private: method[_create]
     *  :arg config: ``Object``
     *  :returns: ``org.geotools.data.memory.MemoryDataStore``
     *
     *  Create the underlying store for the workspace.
     */
    _create: function(config) {
        return new MemoryDataStore();
    }
    
});

exports.MemoryWorkspace = MemoryWorkspace;
