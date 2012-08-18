Polygon basics:

    js> var {Geometry, Polygon} = require("geoscript/geom");

    js> var g = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
    js> g
    <Polygon [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]>
    js> g instanceof Polygon
    true
    js> g instanceof Geometry
    true
    js> g.area
    100
    js> var rings = g.coordinates;
    js> rings.length
    1
    js> var coords = rings[0];
    js> coords.length
    5
    js> coords[0]
    0,0
    js> coords[1]
    10,0
    js> coords[2]
    10,10
    js> coords[3]
    0,10
    js> coords[4]
    0,0

    js> var config = g.config;
    js> config.type
    Polygon
    js> config.coordinates
    0,0,10,0,10,10,0,10,0,0
    js> g.json
    {"type":"Polygon","coordinates":[[[0,0],[10,0],[10,10],[0,10],[0,0]]]}

    js> g.isEmpty()
    false
    js> g.isRectangle()
    true
    js> g.isSimple()
    true
    js> g.isValid()
    true
    
    js> g.bounds.width
    10
    js> g.bounds.height
    10

    js> var jts = Packages.com.vividsolutions.jts;
    js> var wktReader = new jts.io.WKTReader();
    js> var g = Geometry.from_(wktReader.read("POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))"));
    js> g instanceof Polygon
    true
    js> g instanceof Polygon
    true
    js> g.equals(g)
    true
 