var ByteArray = require("binary").ByteArray;
var response = require("ringo/jsgi/response");
var mustache = require("ringo/mustache");
var fs = require("fs");

var Map = require("geoscript/map").Map;
var {gradient, Fill, Stroke} = require("geoscript/style");

var map = new Map({
    layers: [{
        name: "states",
        title: "US States",
        workspace: fs.join(module.directory, "..", "data", "shapefiles"),
        style: gradient({
            expression: "PERSONS / LAND_KM", 
            values: [0, 200], 
            styles: [Fill("#000066"), Fill("red")],
            classes: 10, 
            method: "exponential"
        }).and(
            Fill("red").where("PERSONS / LAND_KM > 200")
        )
    }]
});

exports.index = function(req) {

    var template = getResource("./templates/index.html").content;
    return response.html(
        mustache.to_html(template, {
            host: req.host, port: req.port, layers: map.layers
        })
    );

};

exports.wms = function(request) {
    
    var params = {};
    request.queryString.split("&").forEach(function(pair) {
        var [key, value] = pair.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    var bbox = params["BBOX"].split(",").map(Number);
    var format = params["FORMAT"]

    var image = new ByteArray(map.render({
        imageType: format.split("/").pop(),
        bounds: bbox
    }));

    return {
        status: 200,
        headers: {"Content-Type": format},
        body: [image]
    };

};
