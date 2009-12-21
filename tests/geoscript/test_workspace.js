var assert = require("test/assert");
var workspace = require("geoscript/workspace");

exports["test: create(memory)"] = function() {

    var mem = workspace.create();
    assert.isTrue(mem instanceof workspace.MemoryWorkspace, "instanceof MemoryWorkspace");    

};

exports["test: create(directory)"] = function() {

    var file = require("file");
    var path = file.resolve(module.path, "../data/");

    var dir = workspace.create(path);
    assert.isTrue(dir instanceof workspace.DirectoryWorkspace, "instanceof DirectoryWorkspace");

};

exports["test: DirectoryWorkspace"] = require("./workspace/test_directory");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
