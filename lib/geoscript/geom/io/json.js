var UTIL = require("../../util");
var GEOM = require("../../geom");

var read = function(str) {
    
    var obj = JSON.parse(str);
    if (!obj.type) {
        throw new Error("Invalid GeoJSON, no type member.");
    }
    
    var collection = obj.type === "GeometryCollection";
    var configs;
    if (collection) {
        configs = obj.geometries;
        // TODO: deal with crs
    } else {
        configs = [obj];
    }

    var num = configs.length;
    var geometries = new Array(num);
    for (var i=0; i<num; ++i) {
        geometries[i] = GEOM.create(configs[i]);
    }
    return collection ? geometries : geometries[0];

};

var write = function(geometries) {
    
    var collection = true;
    if (!(UTIL.isArray(config))) {
        collection = false;
        geometries = [geometries];
    }
    
    var num = geometries.length;
    var configs = new Array(num);
    for (var i=0; i<num; ++i) {
        configs[i] = geometries[i].config;
    }
    
    var obj;
    if (collection) {
        obj = {
            type: "GeometryCollection",
            geometries: configs
        };
    } else {
        obj = configs[0];
    }
    
    return JSON.stringify(obj);
    
};

exports.read = read;
exports.write = write;
