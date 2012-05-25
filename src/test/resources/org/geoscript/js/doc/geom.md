Use new wrappers:

    js> defineClass(org.geoscript.js.geom.Point);
    js> var p = new Point([1, 2.0, 3e8]);
    js> p.x
    1
    js> p.y
    2
    js> p.z
    300000000
