var Context = Packages.org.mozilla.javascript.Context;
var GeoScriptWrapFactory = Packages.org.geoscript.js.GeoScriptWrapFactory;

var cx = Context.getCurrentContext();
var wrapFactory = new GeoScriptWrapFactory();
wrapFactory.setJavaPrimitiveWrap(false);
cx.setWrapFactory(wrapFactory);

exports["test: geoscript"] = require("./test_geoscript");

if (require.main == module || require.main == module.id) {
    system.exit(require("test").run(exports));
}