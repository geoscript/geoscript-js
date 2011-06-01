var Layer = require("geoscript/layer").Layer;
var COMMON = require("./common");
var ADMIN = require("../../admin");
var FS = require("fs");

exports.setUp = ADMIN.h2.setUp;
exports.tearDown = ADMIN.h2.tearDown;

var database = FS.join(ADMIN.h2.dest, "geoscript");

var getLayer = function() {
    return new Layer({
        workspace: {type: "h2", database: database},
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
