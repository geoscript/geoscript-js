var assert = require("test/assert");
var workspace = require("geoscript/workspace");

exports["test: constructor"] = function() {

    var mem = new workspace.MemoryWorkspace();
    
    assert.isTrue(mem instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(mem instanceof workspace.MemoryWorkspace, "instanceof MemoryWorkspace");    

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}

