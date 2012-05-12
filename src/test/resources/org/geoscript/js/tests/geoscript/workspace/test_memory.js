var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");

exports["test: constructor"] = function() {

    var mem = new WORKSPACE.Memory();
    
    ASSERT.ok(mem instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(mem instanceof WORKSPACE.Memory, "instanceof Memory");
    
    mem.close(); 

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}

