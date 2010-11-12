var Request = require("ringo/webapp/request").Request;
var Response = require("ringo/webapp/response").Response;
var FS = require("fs");
var Layer = require("geoscript/layer").Layer;

exports.middleware = [
    require("ringo/middleware/etag").middleware,
    require("ringo/middleware/error").middleware,
    require("ringo/middleware/notfound").middleware,
    require("ringo/middleware/static").middleware(module.resolve("static")),
];

exports.app = function(req) {
    var request = new Request(req);
    
    // consume multiple separators
    if (request.path.indexOf("//") > -1) {
        return Response.redirect(request.path.replace(/\/+/g, "/"));
    }

    // walk through collection,item pairs
    var parts = req.pathInfo.split("/");
    parts.shift();
    var id = ".";
    var collection, item;
    for (var i=0, ii=parts.length; i<ii; i+=2) {
        collection = parts[i];
        if (collection === "") {
            return Response.redirect(request.path.substring(0, request.path.length-1));
        }
        item = parts[i+1];
        if (item) {
            if (i===ii-2) {
                item = "item";
            } else {
                item = "";
            }
        } else {
            if (item === "") {
                item = "index";
            } else {
                return Response.redirect(request.path + "/");
            }
        }
        id += "/" + collection + (item ? "/" + item : "");
    }
    
    // look up module for given path
    try {
        var handlers = require(id);
    } catch (err if err.message.indexOf("not found") > -1) {
        throw {notfound: true};
    }
    
    var handler = handlers[request.method];
    var resp;
    
    if (typeof handler === "function") {
        resp = handler(request, parts);
    } else {
        resp = {
            status: 405,
            headers: {"Content-Type": "text/plain"},
            body: [request.method + " not allowed"]
        };
    }

    return resp;
    
}

exports.layers = {
    
    states: new Layer({
        name: "states",
        title: "US States",
        workspace: FS.join(module.directory, "..", "data", "shapefiles"),
        style: {
            fillColor: "steelblue",
            strokeColor: "wheat"
        }
    })
};
