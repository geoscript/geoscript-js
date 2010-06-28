var FS = require("fs");
var Request = require("ringo/webapp/request").Request;
var skinResponse = require("ringo/webapp/response").skinResponse;
var Map = require("geoscript/map").Map;

var map = new Map({
    layers: [{
        name: "states",
        title: "US States",
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
        port: req.port,
        layers: map.layers
    });

};

exports.wms = function(req) {

    var request = new Request(req);
    var bbox = request.queryParams["BBOX"].split(",").map(Number);

    var image = map.render({
        imageType: "png",
        bounds: bbox
    });

    return {
        status: 200,
        headers: {"Content-Type": "image/png"},
        body: [image]
    };

};
