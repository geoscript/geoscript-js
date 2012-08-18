Point basics:

    js> var {Geometry, Point, Bounds} = require("geoscript/geom");

    js> var p = new Point([1, 2.0, 3e8]);
    js> p
    <Point [1, 2, 300000000]>
    js> p instanceof Point
    true
    js> p instanceof Geometry
    true
    js> p.x
    1
    js> p.y
    2
    js> p.z
    300000000
    js> p.coordinates
    1,2,300000000
    
    js> var config = p.config;
    js> config.type
    Point
    js> config.coordinates
    1,2,300000000
    js> p.json
    {"type":"Point","coordinates":[1,2,300000000]}

    js> p.isEmpty()
    false
    js> p.isRectangle()
    false
    js> p.isSimple()
    true
    js> p.isValid()
    true
    
    js> var bounds = p.bounds;
    js> bounds instanceof Bounds
    true
    js> // bounds.empty // TODO: check why this is not true
    
    js> p.projection = "epsg:4326"
    epsg:4326
    js> var Projection = require("geoscript/proj").Projection;
    js> p.projection instanceof Projection
    true
    js> p.projection.id
    EPSG:4326

    js> var p1 = new Point([1, 2])
    js> var p2 = new Point([2, 1])
    js> var p3 = new Point([1, 2])
    js> p1.equals(p2)
    false
    js> p1.equals(p3)
    true
    
    js> var jts = Packages.com.vividsolutions.jts;
    js> var wktReader = new jts.io.WKTReader();
    js> var g = Geometry.from_(wktReader.read("POINT(1 2)"));
    js> g instanceof Point
    true
    js> g instanceof Geometry
    true
    js> g.equals(new Point([1, 2]))
    true
    