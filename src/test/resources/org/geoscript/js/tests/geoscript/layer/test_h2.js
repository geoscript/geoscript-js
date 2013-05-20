var Layer = require("geoscript/layer").Layer;
var COMMON = require("./common");
var ADMIN = require("../../admin");
var FS = require("fs");
var H2 = require("geoscript/workspace").H2;

exports.setUp = ADMIN.h2.setUp;
exports.tearDown = ADMIN.h2.tearDown;

var database = FS.join(ADMIN.h2.dest, "geoscript");

var getLayer = function() {
    return H2({database: database}).get("states");
};

// pull in all common tests
for (var test in COMMON) {
    exports[test] = COMMON[test](getLayer);
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
