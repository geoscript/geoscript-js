Read/write well-known text for geometries:

    js> var WKT = require("geoscript/io/wkt");
    js> var geom = require("geoscript/geom");
    
    js> var g = WKT.read("POINT(1 2)");
    js> g instanceof geom.Geometry
    true
    js> g instanceof geom.Point
    true
    js> g.equals(new geom.Point([1, 2]));
    true
    
    js> var g = new geom.LineString([[1, 2], [3, 4]]);
    js> var wkt = WKT.write(g);
    js> typeof wkt
    string
    js> wkt
    LINESTRING (1 2, 3 4)