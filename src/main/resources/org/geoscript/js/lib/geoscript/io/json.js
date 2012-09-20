require("../geom"); // initialize Geometry prototypes before wrapping

var json = Packages.org.geoscript.js.io.JSON.init(this);

exports.read = json.read;
exports.write = json.write;