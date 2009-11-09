exports["test: MemoryLayer"] = require("./layer/test_memory");
exports["test: Shapefile"] = require("./layer/test_shapefile");

if (require.main === module.id) {
    require("test/runner").run(exports);
}
