var FS = require("fs");
var Request = require("ringo/webapp/request").Request;
var Response = require("ringo/webapp/response").Response;
var Map = require("geoscript/map").Map;
var Fill = require("geoscript/style").Fill;
var Stroke = require("geoscript/style").Stroke;

var ByteArray = require("binary").ByteArray;

var map = new Map({
    layers: [{
        name: "states",
        title: "US States",
        workspace: FS.join(module.directory, "..", "data", "shapefiles"),
        style: Fill("steelblue").and(Stroke("wheat"))
    }]
});

exports.index = function(req) {

    return Response.skin(
        module.resolve("skins/index.html"), 
        {host: req.host, port: req.port, layers: map.layers}
    );

};

exports.wms = function(req) {

    var request = new Request(req);
    var bbox = request.queryParams["BBOX"].split(",").map(Number);

    var image = new ByteArray(map.render({
        imageType: "png",
        bounds: bbox
    }));

    return {
        status: 200,
        headers: {"Content-Type": "image/png"},
        body: [image]
    };

};
