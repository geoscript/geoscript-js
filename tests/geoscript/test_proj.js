var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: transform"] = function() {

    var point = new GEOM.Point([-125, 50]);
    var out = new PROJ.Projection("epsg:3005");
    var transformed = PROJ.transform(point, "epsg:4326", out);
    ASSERT.equal(1071693, Math.floor(transformed.x), "correct x");
    ASSERT.equal(554290, Math.floor(transformed.y), "correct y");
    ASSERT.ok(!!transformed.projection, "transformed geometry is given a projection");
    ASSERT.ok(transformed.projection.equals(out), "transformed geometry is given correct projection");

};

exports["test: Projection"] = function() {
    var p = new PROJ.Projection("EPSG:4326");
    ASSERT.equal("EPSG:4326", p.id, "[srid] correct id");
    
    var wkt = 
        'GEOGCS[' +
            '"GCS_WGS_1984",' +
            'DATUM[' +
                '"D_WGS_1984",' +
                'SPHEROID["WGS_1984",6378137,298.257223563]' +
            '],' +
            'PRIMEM["Greenwich",0],' +
            'UNIT["Degree",0.017453292519943295]' +
        ']';
    var p2 = new PROJ.Projection(wkt);
    ASSERT.equal("EPSG:4326", p2.id, "[wkt] correct id");

};

exports["test: Projection.equals"] = function() {

    var p1 = new PROJ.Projection("EPSG:4326");
    
    var wkt = 
        'GEOGCS[' +
            '"GCS_WGS_1984",' +
            'DATUM[' +
                '"D_WGS_1984",' +
                'SPHEROID["WGS_1984",6378137,298.257223563]' +
            '],' +
            'PRIMEM["Greenwich",0],' +
            'UNIT["Degree",0.017453292519943295]' +
        ']';
    var p2 = new PROJ.Projection(wkt);
    
    ASSERT.ok(p1.equals(p2), "p1 equals p2");
    ASSERT.ok(p2.equals(p1), "p2 equals p1");
    
    var p3 = new PROJ.Projection("epsg:3005");
    ASSERT.isFalse(p1.equals(p3), "p1 doesn't equal p3");

};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}