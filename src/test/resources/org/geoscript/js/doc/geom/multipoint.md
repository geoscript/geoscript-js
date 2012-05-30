MultiPoint basics:

    js> defineClass(org.geoscript.js.geom.MultiPoint);
    js> defineClass(org.geoscript.js.geom.Point);
    js> var MultiPoint = this["org.geoscript.js.geom.MultiPoint"];
    js> var GeometryCollection = this["org.geoscript.js.geom.GeometryCollection"];
    js> var Geometry = this["org.geoscript.js.geom.Geometry"];
    js> var Point = this["org.geoscript.js.geom.Point"];
    
    js> var g = new MultiPoint([[0, 0], [1, 1]]);
    js> g instanceof MultiPoint
    true
    js> g instanceof GeometryCollection
    true
    js> g instanceof Geometry
    true
    
    js> var components = g.components
    js> components.length
    2
    js> var c0 = components[0];
    js> c0 instanceof Point
    true
    js> components[1] instanceof Point
    true
    
    js> var p0 = new Point([0, 0]);
    js> var p1 = new Point([1, 1]);
    js> var g = new MultiPoint([p0, p1]);
    js> g instanceof MultiPoint
    true
    js> g.components[0] instanceof Point
    true
    js> g.coordinates
    0,0,1,1
