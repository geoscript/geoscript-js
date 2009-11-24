exports["test: DirectoryWorkspace"] = require("./workspace/test_directory");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
