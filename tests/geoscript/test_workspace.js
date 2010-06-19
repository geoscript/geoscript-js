var assert = require("assert");
var workspace = require("geoscript/workspace");

exports["test: create(memory)"] = function() {

    var mem = workspace.create();
    assert.ok(mem instanceof workspace.Memory, "instanceof Memory");
    mem.close();

};

exports["test: create(directory)"] = function() {

    var dir = workspace.create(".");
    assert.ok(dir instanceof workspace.Directory, "instanceof Directory");
    dir.close();

};

exports["test: Directory"] = require("./workspace/test_directory");
exports["test: H2"] = require("./workspace/test_h2");
exports["test: Memory"] = require("./workspace/test_memory");
exports["test: PostGIS"] = require("./workspace/test_postgis");

if (require.main == module.id) {
    require("test").run(exports);
}
