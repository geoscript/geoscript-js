var Layer = require("geoscript/layer").Layer;
var COMMON = require("./common");
var ADMIN = require("../../admin");

exports.setup = ADMIN.shp.setup;
exports.teardown = ADMIN.shp.teardown;

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

if (require.main == module) {
    require("test/runner").run(exports);
}
