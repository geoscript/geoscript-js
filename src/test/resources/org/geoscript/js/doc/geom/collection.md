Collection basics:

    js> defineClass(org.geoscript.js.geom.Point);
    js> defineClass(org.geoscript.js.geom.Collection);
    js> var Point = this["org.geoscript.js.geom.Point"];
    js> var Collection = this["org.geoscript.js.geom.Collection"];
    js> var Geometry = this["org.geoscript.js.geom.Geometry"];

    js> var g = new Collection([[0, 0], [1, 1]]);
    js> g instanceof Collection
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