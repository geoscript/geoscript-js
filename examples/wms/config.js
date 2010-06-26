var FS = require("fs");
var Stream = require("io").Stream;
var ByteArray = require("binary").ByteArray;
var Request = require("ringo/webapp/request").Request;
var Map = require("geoscript/map").Map;

var map = new Map({
    layers: [{
        name: "states",
        workspace: FS.join(module.directory, "..", "data", "shapefiles"),
        style: {
            fillColor: "#ff9900",
            strokeColor: "#663300"
        }
    }]
});

exports.app = function(env) {

    var request = new Request(env);
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

