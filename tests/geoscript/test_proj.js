var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj");

exports["test: transform"] = function() {

    var point = new geom.Point([-125, 50]);
    var out = new proj.Projection("epsg:3005");
    var transformed = proj.transform(point, "epsg:4326", out);
    assert.isEqual(1071693, Math.floor(transformed.x), "correct x");
    assert.isEqual(554289, Math.floor(transformed.y), "correct y");
    assert.isTrue(!!transformed.projection, "transformed geometry is given a projection");
    assert.isTrue(transformed.projection.equals(out), "transformed geometry is given correct projection");

};

exports["test: Projection"] = function() {
    var p = new proj.Projection("EPSG:4326");
    assert.isEqual("EPSG:4326", p.id, "[srid] correct id");
    
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
    var p2 = new proj.Projection(wkt);
    assert.isEqual("EPSG:4326", p2.id, "[wkt] correct id");

};

exports["test: Projection.equals"] = function() {

    var p1 = new proj.Projection("EPSG:4326");
    
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
    var p2 = new proj.Projection(wkt);
    
    assert.isTrue(p1.equals(p2), "p1 equals p2");
    assert.isTrue(p2.equals(p1), "p2 equals p1");
    
    var p3 = new proj.Projection("epsg:3005");
    assert.isFalse(p1.equals(p3), "p1 doesn't equal p3");

};

if (require.main === module.id) {
    require("test/runner").run(exports);
}