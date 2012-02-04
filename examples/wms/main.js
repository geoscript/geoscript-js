var fs = require("fs");

// put GeoTools jars on the classpath
var home = getResource("../../package.json").getParentRepository().path;
var jars = fs.join(home, "jars");
fs.list(jars).forEach(function(jar) {
    addToClasspath(fs.join(jars, jar));
});

var actions = require("./actions");
var response = require("ringo/jsgi/response");

// minimalistic request dispatcher
exports.app = function(request) {
    var path = request.pathInfo.slice(1) || "index";
    // 1. resolve against actions
    if (typeof actions[path] === "function") {
        return actions[path](request);
    }
    // 2. resolve against static folder
    var resource = getResource("./static/" + path);
    if (resource.exists()) {
        return response.static(resource);
    }
    // 3. return 404 response
    return response.notFound(request.pathInfo);
}

// start the server
if (require.main == module) {
    require("ringo/httpserver").main(module.id);
}
