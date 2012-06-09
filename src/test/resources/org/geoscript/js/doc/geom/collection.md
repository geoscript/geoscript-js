Collection basics:

    js> var {Geometry, Point, GeometryCollection} = require("geoscript/geom");

    js> var g = new GeometryCollection([[0, 0], [1, 1]]);
    js> g instanceof GeometryCollection
    true
    js> g instanceof Geometry
    true
    js> var components = g.components;
    js> components.length
    2
    js> var c0 = components[0];
    js> c0 instanceof Point
    true
    js> c0.coordinates
    0,0
    js> components[1] instanceof Point
    true
    js> g.coordinates
    0,0,1,1