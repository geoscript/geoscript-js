var MemoryDataStore = Packages.org.geotools.data.memory.MemoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");

var MemoryWorkspace = util.extend(Workspace, {
    
    constructor: function MemoryWorkspace(config) {
        Workspace.prototype.constructor.apply(this, [config]);
    },
    
    _create: function(config) {
        return new MemoryDataStore();
    }
    
});

exports.MemoryWorkspace = MemoryWorkspace;
