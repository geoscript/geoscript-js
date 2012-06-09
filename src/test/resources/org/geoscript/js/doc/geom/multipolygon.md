MultiPolygon basics:

    js> var {Geometry, GeometryCollection, MultiPolygon, Polygon} = require("geoscript/geom");

    js> var g = new MultiPolygon([[[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]]);
    js> g instanceof MultiPolygon
    true
    js> g instanceof GeometryCollection
    true
    js> g instanceof Geometry
    true
    js> g.json
    {"type":"MultiPolygon","coordinates":[[[[0,0],[1,0],[1,1],[0,1],[0,0]]]]}
    
    js> var components = g.components
    js> components.length
    1
    js> var c0 = components[0];
    js> c0 instanceof Polygon
    true
    
    js> var p0 = new Polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]);
    js> var g = new MultiPolygon([p0]);
    js> g instanceof MultiPolygon
    true
    js> g.components[0] instanceof Polygon
    true
    js> g.coordinates
    0,0,1,0,1,1,0,1,0,0
