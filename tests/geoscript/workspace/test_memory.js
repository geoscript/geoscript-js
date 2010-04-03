var assert = require("test/assert");
var workspace = require("geoscript/workspace");

exports["test: constructor"] = function() {

    var mem = new workspace.Memory();
    
    assert.isTrue(mem instanceof workspace.Workspace, "instanceof Workspace");
    assert.isTrue(mem instanceof workspace.Memory, "instanceof Memory");
    
    mem.close(); 

};

if (require.main == module) {
    require("test/runner").run(exports);
}

