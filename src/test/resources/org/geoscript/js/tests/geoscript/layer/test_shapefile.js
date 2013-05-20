var Layer = require("geoscript/layer").Layer;
var COMMON = require("./common");
var ADMIN = require("../../admin");
var Directory = require("geoscript/workspace").Directory;

exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

var getLayer = function() {
    return Directory(ADMIN.shp.dest).get("states");
};

// pull in all common tests
for (var test in COMMON) {
    exports[test] = COMMON[test](getLayer);
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
