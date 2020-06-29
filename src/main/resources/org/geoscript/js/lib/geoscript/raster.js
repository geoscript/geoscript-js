var Util = require("./util");
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;

Packages.org.geoscript.js.raster.Module.init(this);
exports.Band   = this["org.geoscript.js.raster.Band"];
exports.Raster = this["org.geoscript.js.raster.Raster"];
exports.Format = this["org.geoscript.js.raster.Format"];

var registry = new Registry();
exports.create = registry.create;

registry.register(new Factory(exports.Format, {
  handles: function(config) {
    return true;
  }
}));

registry.register(new Factory(exports.Raster, {
  handles: function(config) {
    return true;
  }
}));

registry.register(new Factory(exports.Band, {
  handles: function(config) {
    return true;
  }
}));