var Directory = require("geoscript/workspace").Directory;
var {Fill, Shape, gradient} = require("geoscript/style");
var Map = require("geoscript/map").Map;

var states = Directory("data").get("states");

states.style = gradient({
    expression: "PERSONS / LAND_KM", 
    values: [0, 200], 
    // styles: [Fill("#000066"), Fill("red")], 
    styles: [
        Shape({name: "circle", size: 2, fill: "#000066"}), 
        Shape({name: "circle", size: 9, fill: "red"})
    ], 
    classes: 10, 
    method: "exponential"
}).and(
    Fill("red").where("PERSONS / LAND_KM > 200")
);

var map = Map([states]);

map.render({path: "states.png"});
