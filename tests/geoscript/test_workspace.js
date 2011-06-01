var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");

exports["test: create(memory)"] = function() {

    var mem = WORKSPACE.create();
    ASSERT.ok(mem instanceof WORKSPACE.Memory, "instanceof Memory");
    mem.close();

};

exports["test: create(directory)"] = function() {

    var dir = WORKSPACE.create(".");
    ASSERT.ok(dir instanceof WORKSPACE.Directory, "instanceof Directory");
    dir.close();

};

exports["test: Directory"] = require("./workspace/test_directory");
exports["test: H2"] = require("./workspace/test_h2");
exports["test: Memory"] = require("./workspace/test_memory");
// exports["test: PostGIS"] = require("./workspace/test_postgis");

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
