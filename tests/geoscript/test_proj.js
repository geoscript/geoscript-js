var assert = require("test/assert"),
    geom = require("geoscript/geom"),
    proj = require("geoscript/proj");

exports["test: transform"] = function() {

    var p = new geom.Point([-125, 50]);
    var rp = proj.transform(p, "epsg:4326", "epsg:3005");
    assert.isEqual(1071693, Math.floor(rp.x));
    assert.isEqual(554289, Math.floor(rp.y));

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

if (require.main === module.id) {
    require("test/runner").run(exports);
}