var FS = require("fs");
var Stream = require("io").Stream;
var ByteArray = require("binary").ByteArray;
var Request = require("ringo/webapp/request").Request;
var skinResponse = require("ringo/webapp/response").skinResponse;
var Map = require("geoscript/map").Map;

var map = new Map({
    layers: [{
        name: "states",
        workspace: FS.join(module.directory, "..", "data", "shapefiles"),
        style: {
            fillColor: "steelblue",
            strokeColor: "wheat"
        }
    }]
});

exports.index = function(req) {

    return skinResponse("skins/index.html", {
        host: req.host,
        port: req.port
    });

};

exports.wms = function(req) {

    var request = new Request(req);
    var bbox = request.queryParams["BBOX"].split(",").map(Number);
    var stream = new Stream(new java.io.ByteArrayOutputStream());

    map.render({
        imageType: "png",
        bounds: bbox,
        output: stream
    });

    var body = new ByteArray(stream.unwrap().toByteArray());
    return {
        status: 200,
        headers: {"Content-Type": "image/png"},
        body: [body]
    };

};
