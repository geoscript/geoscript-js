var ASSERT = require("assert");
var WORKSPACE = require("geoscript/workspace");
var LAYER = require("geoscript/layer");
var GEOM = require("geoscript/geom");
var FS = require("fs");

exports["test: constructor"] = function() {

    var Files = Packages.java.nio.file.Files;
    var file = Files.createTempDirectory("geobuf").toFile().getAbsolutePath();
    var geobuf = new WORKSPACE.Geobuf({file: file});
    
    ASSERT.ok(geobuf instanceof WORKSPACE.Workspace, "instanceof Workspace");
    ASSERT.ok(geobuf instanceof WORKSPACE.Geobuf, "instanceof Geobuf");
    
    geobuf.close();

};

exports["test: create"] = function() {

    var Files = Packages.java.nio.file.Files;
    var file = Files.createTempDirectory("geobuf").toFile().getAbsolutePath();
    var geobuf = new WORKSPACE.Geobuf({file: file});

    var layer = new LAYER.Layer({
        name: "cities",
       fields: [{
           name: "name", type: "String"
       }, {
           name: "geom", type: "Point"
       }]
    });
    var geobufLayer = geobuf.add(layer);

    geobufLayer.add({name: "San Francisco", geom: new GEOM.Point([-122.42, 37.78])});
    geobufLayer.add({name: "New York", geom: new GEOM.Point([-73.58, 40.47])});
    ASSERT.ok(geobufLayer.count == 2);

    geobuf.close();
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
