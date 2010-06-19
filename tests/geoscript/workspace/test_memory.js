var assert = require("assert");
var workspace = require("geoscript/workspace");

exports["test: constructor"] = function() {

    var mem = new workspace.Memory();
    
    assert.ok(mem instanceof workspace.Workspace, "instanceof Workspace");
    assert.ok(mem instanceof workspace.Memory, "instanceof Memory");
    
    mem.close(); 

};

if (require.main == module.id) {
    require("test").run(exports);
}

