// TODO: determine if this can be avoided - seems necessary to use run.jar 
// if geoscript is not in ringojs/packages
var lib = getResource("../lib");
if (require.paths.indexOf(lib) === -1) {
    require.paths.push(lib);
}

exports["test: geoscript"] = require("./test_geoscript");

if (require.main == module || require.main == module.id) {
    system.exit(require("test").run(exports));
}