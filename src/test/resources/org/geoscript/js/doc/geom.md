Use new wrappers:

    js> defineClass(org.geoscript.js.geom.Point);
    js> var Point = this["org.geoscript.js.geom.Point"];
    js> var Geometry = this["org.geoscript.js.geom.Geometry"];

    js> var p = new Point([1, 2.0, 3e8]);
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
