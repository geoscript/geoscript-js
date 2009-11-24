var DirectoryDataStore = Packages.org.geotools.data.directory.DirectoryDataStore;
var Workspace = require("geoscript/workspace/workspace").Workspace;
var util = require("geoscript/util");

var DirectoryWorkspace = util.extend(Workspace, {
    
    constructor: function DirectoryWorkspace(config) {
        Workspace.prototype.constructor.apply(this, [config]);
    },
    
    _create: function(dir) {
        return new DirectoryDataStore(
            util.toFile(dir), new java.net.URI("http://geoscript.org")
        );
    }
    
});

exports.DirectoryWorkspace = DirectoryWorkspace;
