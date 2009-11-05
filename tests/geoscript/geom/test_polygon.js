var assert = require("test/assert"),
    geom = require("geoscript/geom");
    
exports["test: Polygon"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.isTrue(p instanceof geom.Geometry, "polygon is a geometry");
    assert.isTrue(p instanceof geom.Polygon, "polygon is a polygon");
    assert.is(2, p.coordinates.length, "polygon has two items in coordinates");
    assert.is(48600, p.area, "polygon has correct area");
    
};

exports["test: Polygon.wkt"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    assert.is("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))", p.wkt, "correct wkt");

};


if (require.main === module.id) {
    require("test/runner").run(exports);
}
