var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
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

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}