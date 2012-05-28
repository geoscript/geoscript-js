Point basics:

    js> defineClass(org.geoscript.js.geom.LineString);
    js> var LineString = this["org.geoscript.js.geom.LineString"];
    js> var Geometry = this["org.geoscript.js.geom.Geometry"];

    js> var l = new LineString([[0, 2.0], [10.0, 2]]);
    js> l instanceof LineString
    true
    js> l instanceof Geometry
    true
    js> l.length
    10
    js> var coords = l.coordinates;
    js> coords.length
    2
    js> coords[0]
    0,2
    js> coords[1]
    10,2

    js> l.isEmpty()
    false
    js> l.isRectangle()
    false
    js> l.isSimple()
    true
    js> l.isValid()
    true
