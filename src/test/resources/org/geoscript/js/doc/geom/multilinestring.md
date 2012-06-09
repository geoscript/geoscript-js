MultiLineString basics:

    js> var {Geometry, GeometryCollection, MultiLineString, LineString} = require("geoscript/geom");

    js> var g = new MultiLineString([[[0, 0], [1, 1]], [[0, 0], [-1, -1]]]);
    js> g instanceof MultiLineString
    true
    js> g instanceof GeometryCollection
    true
    js> g instanceof Geometry
    true
    js> g.json
    {"type":"MultiLineString","coordinates":[[[0,0],[1,1]],[[0,0],[-1,-1]]]}
    
    js> var components = g.components
    js> components.length
    2
    js> var c0 = components[0];
    js> c0 instanceof LineString
    true
    js> components[1] instanceof LineString
    true
    
    js> var l0 = new LineString([[0, 0], [1, 1]]);
    js> var l1 = new LineString([[1, 1], [2, 2]]);
    js> var g = new MultiLineString([l0, l1]);
    js> g instanceof MultiLineString
    true
    js> g.components[0] instanceof LineString
    true
    js> g.coordinates
    0,0,1,1,1,1,2,2
