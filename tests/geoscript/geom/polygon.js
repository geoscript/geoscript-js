var assert = require("test/assert"),
    geom = require("geoscript/geom");
    
exports.test_Polygon = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.isTrue(p instanceof geom.Geometry, "polygon is a geometry");
    assert.isTrue(p instanceof geom.Polygon, "polygon is a polygon");
    assert.isEqual(2, p.coordinates.length, "polygon has two items in coordinates");
    assert.isEqual(48600, p.getArea(), "polygon has correct area");
    
};

exports.test_wkt = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    assert.isEqual("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))", p.toWKT(), "correct wkt");

};


if (require.main === module.id) {
    require("test/runner").run(exports);
}
