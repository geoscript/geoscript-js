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

exports["test: read geometry collection"] = function() {
    var json = '{' +
        '"type": "GeometryCollection",' +
        '"geometries": [{' +
            '"type": "Point",' +
            '"coordinates": [100.0, 0.0]' +
        '},{' +
            '"type": "LineString",' +
            '"coordinates": [ [101.0, 0.0], [102.0, 1.0] ]' +
        '}]' +
    '}';
    var geoms = parser.read(json);
    ASSERT.ok(geoms instanceof GEOM.GeometryCollection);
    ASSERT.ok(geoms.equalsExact(new GEOM.GeometryCollection([
        new GEOM.Point([100, 0]),
        new GEOM.LineString([[101, 0], [102, 1]])
    ])));
}

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

exports["test: read feature collection"] = function() {
    var json = '{' +
        '"type": "FeatureCollection",' +
        '"features": [{' +
            '"type": "Feature",' +
            '"geometry": {"type": "Point", "coordinates": [102.0, 0.5]},' +
            '"properties": {"prop0": "value0"}' +
        '}, {' +
            '"type": "Feature",' +
            '"geometry": {' +
                '"type": "LineString",' +
                '"coordinates": [' +
                    '[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]' +
                ']' +
            '},' +
            '"properties": {' +
                '"prop0": "value0",' +
                '"prop1": 0.0' +
            '}' +
        '}, {' +
            '"type": "Feature",' +
            '"geometry": {' +
                '"type": "Polygon",' +
                '"coordinates": [[' +
                    '[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],' +
                    '[100.0, 1.0], [100.0, 0.0]' +
                ']]' +
            '},' +
            '"properties": {' +
                '"prop0": "value0",' +
                '"prop1": {"this": "that"}' +
            '}' +
        '}]' +
    '}';
    
    var collection = parser.read(json);
    ASSERT.ok(collection instanceof FeatureCollection);
    ASSERT.strictEqual(collection.size, 3);
    var features = [];
    for (var feature in collection) {
        features.push(feature);
    }
    ASSERT.ok(features[0] instanceof Feature);
    ASSERT.strictEqual(features[0].properties.prop0, "value0");
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

exports["test: write geometry collection"] = function() {
    var geom = new GEOM.GeometryCollection([
        new GEOM.Point([100, 0]),
        new GEOM.LineString([[101, 0], [102, 1]])
    ]);
    var json = parser.write(geom);
    ASSERT.strictEqual(typeof json, "string");
    
    var obj = JSON.parse(json);
    
    ASSERT.strictEqual(obj.type, "GeometryCollection");
    var geometries = obj.geometries;
    ASSERT.strictEqual(geometries.length, 2);
    
    var point = geometries[0];
    ASSERT.strictEqual(point.type, "Point");
    ASSERT.deepEqual(point.coordinates, [100, 0]);
    
    var line = geometries[1];
    ASSERT.strictEqual(line.type, "LineString");
    ASSERT.deepEqual(line.coordinates, [[101, 0], [102, 1]]);
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}