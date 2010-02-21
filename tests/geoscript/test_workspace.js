var assert = require("test/assert");
var workspace = require("geoscript/workspace");

exports["test: create(memory)"] = function() {

    var mem = workspace.create();
    assert.isTrue(mem instanceof workspace.Memory, "instanceof Memory");    

};

exports["test: create(directory)"] = function() {

    var dir = workspace.create(".");
    assert.isTrue(dir instanceof workspace.Directory, "instanceof Directory");

};

exports["test: Directory"] = require("./workspace/test_directory");
exports["test: H2"] = require("./workspace/test_h2");
exports["test: Memory"] = require("./workspace/test_memory");
exports["test: PostGIS"] = require("./workspace/test_postgis");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
