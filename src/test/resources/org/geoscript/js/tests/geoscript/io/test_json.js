var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var {Feature, FeatureCollection} = require("geoscript/feature");
var parser = require("geoscript/io/json");


exports["test: read point"] = function() {
    
    var json, point;
    
    // basic point
    json = '{"type": "Point", "coordinates": [1, 2]}';
    point = parser.read(json);
    
    ASSERT.ok(point instanceof GEOM.Point);
    ASSERT.ok(point.equals(new GEOM.Point([1, 2])));

};

exports["test: read linestring"] = function() {
    var json, line;
    
    // basic linestring
    json = '{' +
        '"type": "LineString",' +
        '"coordinates": [' + 
            '[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]' + 
         ']' +
    '}';
    line = parser.read(json);
    ASSERT.ok(line instanceof GEOM.LineString);
    ASSERT.ok(line.equals(new GEOM.LineString([
        [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
    ])));
};

exports["test: read feature"] = function() {
    var json, feature;
    
    json = '{' + 
        '"type": "Feature",' +
        '"geometry": {' +
            '"type": "Point", "coordinates": [1, 2]' +
        '}, ' + 
        '"properties": {' +
            '"foo": "bar",' +
            '"num": 10' +
        '}' +
    '}';
    feature = parser.read(json);
    ASSERT.ok(feature instanceof Feature);
    ASSERT.ok(feature.geometry instanceof GEOM.Point);
    ASSERT.ok(feature.geometry.equals(new GEOM.Point([1, 2])));
    ASSERT.strictEqual(feature.get("foo"), "bar");
    ASSERT.strictEqual(feature.get("num"), 10);
}

exports["test: write polygon"] = function() {
    
    var poly = new GEOM.Polygon([
        [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]],
        [[2, 2], [8, 2], [8, 8], [2, 8], [2, 2]]
    ]);
    
    var json = parser.write(poly);
    
    ASSERT.strictEqual(typeof json, "string");
    var obj = JSON.parse(json);
    
    ASSERT.strictEqual(obj.type, "Polygon");
    var coordinates = obj.coordinates;
    ASSERT.strictEqual(coordinates.length, 2);
    ASSERT.deepEqual(coordinates[0], [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]);
    ASSERT.deepEqual(coordinates[1], [[2, 2], [8, 2], [8, 8], [2, 8], [2, 2]]);
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}