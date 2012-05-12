var Layer = require("geoscript/layer").Layer;
var COMMON = require("./common");
var ADMIN = require("../../admin");

exports.setUp = ADMIN.shp.setUp;
exports.tearDown = ADMIN.shp.tearDown;

var getLayer = function() {
    return new Layer({
        workspace: ADMIN.shp.dest,
        name: "states"
    });
};

// pull in all common tests
for (var test in COMMON) {
    exports[test] = COMMON[test](getLayer);
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
