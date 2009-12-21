var assert = require("test/assert"),
    geom = require("geoscript/geom");
    
exports["test: constructor"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    assert.isTrue(p instanceof geom.Geometry, "polygon is a geometry");
    assert.isTrue(p instanceof geom.Polygon, "polygon is a polygon");
    assert.is(2, p.coordinates.length, "polygon has two items in coordinates");
    assert.is(48600, p.area, "polygon has correct area");
    
};

exports["test: wkt"] = function() {

    var p = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    assert.is("POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))", p.wkt, "correct wkt");

};

exports["test: json"] = function() {

    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var json = g.json;
    assert.is("string", typeof json, "json is string");
    var obj, msg;
    try {
        obj = JSON.decode(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        assert.is("Polygon", obj.type, "correct type");
        assert.isSame(g.coordinates, obj.coordinates, "correct coordinates");
    } else {
        assert.isTrue(false, "invalid json: " + msg);
    }
    
};

exports["test: fromJSON"] = function() {

    var g = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var str = '{' +
        '"type": "Polygon",' +
        '"coordinates": [' +
            '[ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],' +
            '[ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]' +
        ']' +
    '}';

    var obj, msg;
    try {
        obj = geom.Geometry.fromJSON(str);
    } catch (err) {
        msg = err.message;
    }
    if (obj) {
        assert.isTrue(obj instanceof geom.Geometry, "polygon from json is a geometry");
        assert.isTrue(obj instanceof geom.Polygon, "polygon from json is a polygon");
        assert.isTrue(g.equals(obj), "geometry equals obj");
    } else {
        assert.isTrue(false, "trouble parsing json: " + msg);
    }

};


if (require.main === module.id) {
    require("test/runner").run(exports);
}
