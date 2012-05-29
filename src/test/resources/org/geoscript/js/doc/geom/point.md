Point basics:

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

    js> p.isEmpty()
    false
    js> p.isRectangle()
    false
    js> p.isSimple()
    true
    js> p.isValid()
    true

    js> var p1 = new Point([1, 2])
    js> var p2 = new Point([2, 1])
    js> var p3 = new Point([1, 2])
    js> p1.equals(p2)
    false
    js> p1.equals(p3)
    true
    
    js> var jts = Packages.com.vividsolutions.jts;
    js> var wktReader = new jts.io.WKTReader();
    js> var jtsPoint = wktReader.read("POINT(1 2)");
    js> jtsPoint instanceof Point
    true
    js> jtsPoint instanceof Geometry
    true
    js> jtsPoint.equals(new Point([1, 2]))
    true
    