
var util = require("geoscript/util");
util.createRegistry(exports);

exports.Workspace = require("./workspace/workspace").Workspace;
exports.Memory = require("./workspace/memory").Memory;
exports.Directory = require("./workspace/directory").Directory;
exports.Postgis = require("./workspace/postgis").Postgis;
exports.H2 = require("./workspace/h2").H2;

exports.memory = new exports.Memory();
