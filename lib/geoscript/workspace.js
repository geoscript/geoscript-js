
var util = require("geoscript/util");
util.createRegistry(exports);

exports.Workspace = require("./workspace/workspace").Workspace;
exports.Memory = require("./workspace/memory").Memory;
exports.Directory = require("./workspace/directory").Directory;
exports.Postgis = require("./workspace/postgis").Postgis;

exports.memory = new exports.Memory();
