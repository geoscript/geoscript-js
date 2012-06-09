LineString basics:

    js> var {Geometry, LineString, Bounds} = require("geoscript/geom");

    js> var l = new LineString([[0, 2.0], [10.0, 2]]);
    js> l instanceof LineString
    true
    js> l instanceof Geometry
    true
    js> l.length
    10
    js> var coords = l.coordinates;
    js> coords.length
    2
    js> coords[0]
    0,2
    js> coords[1]
    10,2

    js> var config = l.config;
    js> config.type
    LineString
    js> config.coordinates
    0,2,10,2
    js> l.json
    {"type":"LineString","coordinates":[[0,2],[10,2]]}

    js> l.isEmpty()
    false
    js> l.isRectangle()
    false
    js> l.isSimple()
    true
    js> l.isValid()
    true
    
    js> var bounds = l.bounds
    js> bounds instanceof Bounds
    true
    js> bounds.width
    10
    js> bounds.height
    0

    js> var jts = Packages.com.vividsolutions.jts;
    js> var wktReader = new jts.io.WKTReader();
    js> var jtsLine = wktReader.read("LINESTRING(0 0, 1 1)");
    js> jtsLine instanceof LineString
    true
    js> jtsLine instanceof Geometry
    true
    js> jtsLine.equals(new LineString([[0, 0], [1, 1]]))
    true
 