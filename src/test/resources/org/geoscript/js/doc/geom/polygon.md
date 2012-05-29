Polygon basics:

    js> defineClass(org.geoscript.js.geom.Polygon);
    js> var Polygon = this["org.geoscript.js.geom.Polygon"];
    js> var Geometry = this["org.geoscript.js.geom.Geometry"];

    js> var g = new Polygon([[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]);
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

    js> g.isEmpty()
    false
    js> g.isRectangle()
    true
    js> g.isSimple()
    true
    js> g.isValid()
    true

    js> var jts = Packages.com.vividsolutions.jts;
    js> var wktReader = new jts.io.WKTReader();
    js> var jtsGeom = wktReader.read("POLYGON((0 0, 10 0, 10 10, 0 10, 0 0))");
    js> jtsGeom instanceof Polygon
    true
    js> jtsGeom instanceof Polygon
    true
    js> jtsGeom.equals(g)
    true
 