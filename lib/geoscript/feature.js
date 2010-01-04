var util = require("geoscript/util");
util.createRegistry(exports);

exports.Feature = require("./feature/feature").Feature;
exports.Schema = require("./feature/schema").Schema;
