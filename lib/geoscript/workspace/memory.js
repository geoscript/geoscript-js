var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");

var prepConfig = function(config) {
    if (config === undefined) {
        config = {};
    }
    return config;
};

/** api: (define)
 *  module = workspace
 *  class = Memory
 */

/** api: (extends)
 *  workspace/workspace.js
 */
var Memory = util.extend(Workspace, {
    
    /** api: constructor
     *  .. class:: Memory
     *
     *      Create a memory based workspace.
     */
    constructor: function Memory(config) {
        config = prepConfig(config);
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

exports.Memory = Memory;

// register a memory factory for the module
var workspace = require("geoscript/workspace");
var Factory = require("geoscript/factory").Factory;

workspace.register(new Factory(Memory, {
    handles: function(config) {
        config = prepConfig(config);
        var capable = false;
        if (typeof config === "object") {
            if (config.type) {
                if (config.type.toLowerCase() === "memory") {
                    capable = true;
                }
            } else if (Object.keys(config).length === 0) {
                capable = true;
            }
        }
        return capable;
    }
}));
